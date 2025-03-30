'use client'

import { useState, useEffect } from 'react';
import File from './File';

async function getFiles() {
  try {
    let res = await fetch("http://localhost:4000/files");
    let data = await res.json();
    return data.files;
  } catch (e) {
    console.log('error')
    return [{
      name: "WIP"
    }];
  }
}

const Files: React.FC = () => {
  const [files, setFiles] = useState([]);
  useEffect(()=>{
    getFiles().then((files)=> setFiles(files));
  },[])

  return (
    <div>
      {files.map((file, i) => {
        return <File key={i} file={file}></File>
      })}
    </div>

  )
}

export default Files;