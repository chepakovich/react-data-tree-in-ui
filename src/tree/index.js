import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './index.css';
import initialData from './data';

const BIN_ID = '61f564001960493ad184a1e5';
const SECRET_KEY =
  '$2b$10$X30jr7FpvDKoBFgFaBuTje.r27ObV8TQ6Fp7wy0bHMHr7tU6HDVve';

export default function Tree() {
  // const [data, setData] = useState(initialData);
  const [data, setData] = useState([]);
  const [tree, setTree] = useState([]);
  const [sorted, setSorted] = useState(false);
  const [addLevels, setAddLevels] = useState(false);

  const ref1 = useRef();
  const ref2 = useRef();

  const generateNewTree = (newData) => {
    const newTree = [];
    const generateTree = (inputArr, level) => {
      if (inputArr.length === 0) return;
      let name;
      inputArr.forEach((el) => {
        name = el.name;
        newTree.push({
          level,
          name,
        });
        generateTree(el.children, level + 1);
      });
      newTree.push({
        levelEnd: true,
        level,
        name,
      });
    };
    generateTree(newData, 0);
    setTree(newTree);
  };

  const fetchData = () => {
    const headers = {
      'Content-Type': 'application/json',
      'secret-key': SECRET_KEY,
    };

    axios
      .get(`https://api.jsonbin.io/b/${BIN_ID}`, { headers })
      .then((res) => {
        setData(res.data);
        generateNewTree(res.data);
      })
      .catch((error) => {
        console.error('error:', error);
      });
  };

  const persistData = (data) => {
    const headers = {
      'Content-Type': 'application/json',
      'X-Master-Key': SECRET_KEY,
    };

    axios
      .put(`https://api.jsonbin.io/v3/b/${BIN_ID}`, data, { headers })
      .then((res) => {
        console.log('res:', res);
      })
      .catch((error) => {
        console.error('error:', error);
      });
  };

  useEffect(() => {
    // const position1 = ref1.current.getBoundingClientRect();
    // const position2 = ref2.current.getBoundingClientRect();
    // console.log('position1:', position1.x);
    // console.log('position2:', position2.x);

    // generateNewTree(data);
    fetchData();
  }, []);

  const findNestedArr = (arr, level, item) => {
    if (arr.length !== 0 && level <= item.level) {
      for (const el of arr) {
        if (level === item.level && el.name === item.name) {
          return arr;
        }
        const result = findNestedArr(el.children, level + 1, item);
        if (result) return result;
      }
    }
  };

  const handleKeyDown = (e, item) => {
    if (e.key === 'Enter') {
      const foundArr = findNestedArr(data, 0, item);
      if (foundArr) {
        foundArr.push({
          name: e.target.value,
          children: [],
        });
        setData(data);
        generateNewTree(data);
        persistData(data);
      }
      e.target.value = '';
    }
  };

  const addNewLevel = (e, item) => {
    if (e.key === 'Enter') {
      const foundArr = findNestedArr(data, 0, item);
      if (foundArr) {
        const ind = foundArr.findIndex((obj) => obj.name === item.name);
        foundArr[ind].children.push({
          name: e.target.value,
          children: [],
        });
        setData(data);
        generateNewTree(data);
        persistData(data);
      }
      e.target.value = '';
    }
  };

  const handleDelete = (item) => {
    const foundArr = findNestedArr(data, 0, item);
    if (foundArr) {
      const ind = foundArr.findIndex((obj) => obj.name === item.name);
      foundArr.splice(ind, 1);
      setData(data);
      generateNewTree(data);
      persistData(data);
    }
  };

  const sortTree = (arr) => {
    const recursiveSort = (inputArr) => {
      if (arr.length === 0) return;
      inputArr.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      for (const el of inputArr) {
        recursiveSort(el.children);
      }
    };

    recursiveSort(arr);
    generateNewTree(arr, 0);
    setSorted(true);
  };

  const toggle = () => {
    if (sorted) {
      generateNewTree(data, 0);
      setSorted(false);
    } else {
      sortTree(JSON.parse(JSON.stringify(data)));
    }
  };

  return (
    <div className="tree">
      {/* <p className="level0">root</p>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;<span ref={ref1}>ant</span></p>
      <p className="level1">
        <span ref={ref2}>ant</span>
      </p>
      <p className="level1">ant</p>
      <p className="level1">bear</p>
      <p className="level2">cat</p>
      <p className="level2">dog</p>
      <p className="level3">elephant</p>
      <p className="level1">frog</p> */}

      <button type="button" class="btn btn-primary btn-sm" onClick={toggle}>
        Toggle
      </button>
      <button
        type="button"
        class="btn btn-secondary btn-sm"
        onClick={() => setAddLevels(!addLevels)}
      >
        {addLevels ? 'Hide inputs for new levels' : 'Add levels'}
      </button>

      {tree.map((item, index) => {
        // let insert = '';
        // for (let i = 0; i < item.level; i++) {
        //   insert += '.';
        // }
        // const modifiedName = item.name[0] + insert + item.name.substring(1);
        const modifiedName = item.name;
        return (
          <div key={index}>
            {!item.levelEnd && (
              <p className={`level${item.level}`}>
                {modifiedName}
                {` `}
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDelete(item)}
                >
                  ???
                </span>
                {addLevels && (
                  <input type="text" onKeyDown={(e) => addNewLevel(e, item)} />
                )}
              </p>
            )}
            {item.levelEnd && (
              <div className={`level${item.level}`}>
                <input type="text" onKeyDown={(e) => handleKeyDown(e, item)} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
