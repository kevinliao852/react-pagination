import './App.css';
import { useEffect, useState } from 'react';

function App() {
  return (
    <div>
      {/* <PostForm /> */}
      <PostView />
    </div>
  );
}

const PostForm = () => {
  return (
    <div>
      <form>
        <input />
        <input />
        <input />
      </form>
    </div>
  );
};

const usePagination = (size, data) => {
  const [page, setPage] = useState(0);

  const onSubtract = () => {
    if (page <= 0) return;
    setPage((prevPage) => --prevPage);
  };
  const onPlus = () => {
    if (page >= data.length / size - 1) return;
    setPage((prevPage) => ++prevPage);
  };

  useEffect(() => {
    setPage(size);
  }, []);

  const generatePaginationData = () => {
    if (!data) {
      return [];
    }

    return data.slice(page * size, page * size + size);
  };

  return { page, setPage, generatePaginationData, onSubtract, onPlus };
};

const PaginationView = ({ size, value, maxValue, onHandleClick }) => {
  const { page, setPage, generatePaginationData, onPlus, onSubtract } =
    usePagination(5);

  const [pageList, setPageList] = useState([]);

  useEffect(() => {
    if (pageList.length === 0) {
      console.log(456);
      setPageList(new Array(size).fill(null).map((_, index) => value + index));
      return;
    }
    if (value <= 0 || value >= maxValue) {
      return;
    }

    if (value == pageList[pageList.length - 1]) {
      setPageList((prevPageList) => {
        return pageList.map((page, index) => ++page);
      });
    }
    if (value == pageList[0]) {
      setPageList((prevPageList) => {
        return pageList.map((page, index) => --page);
      });
    }
  }, [value]);

  return (
    <div>
      {pageList &&
        pageList.map((value) => (
          <button onClick={() => onHandleClick(value)} key={value}>
            {value}
          </button>
        ))}
      {pageList[0] + size <= maxValue ? (
        <>
          {pageList[0] + size !== maxValue && <button>...</button>}
          <button onClick={() => onHandleClick(maxValue)}>{maxValue}</button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

const PostView = () => {
  const [posts, setPosts] = useState([]);
  const { page, setPage, generatePaginationData, onPlus, onSubtract } =
    usePagination(5, posts);
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((data) => data.json())
      .then((postList) => {
        setPosts(postList);
      });
  }, []);
  return (
    <div>
      <table border={1}>
        <th scope="col">index</th>
        <th scope="col">title</th>
        {generatePaginationData(posts) &&
          generatePaginationData(posts).map(({ title, id }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{title}</td>
            </tr>
          ))}
      </table>
      <button onClick={() => onSubtract()}>-</button>
      <PaginationView
        size={4}
        value={page}
        onHandleClick={setPage}
        maxValue={posts.length / 5 - 1}
      />
      <div>page {page}</div>
      <button onClick={() => onPlus()}>+</button>
    </div>
  );
};

export default App;
