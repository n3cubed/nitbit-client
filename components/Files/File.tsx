import Link from "next/link";

const File: React.FC<{ file: any }> = ({ file }) => {
  return (
    <div>
      <div>{file.name}</div>
      {/* <Link href="http://localhost:4000/get-files"></Link> */}
    </div>
  );
};

export default File;
