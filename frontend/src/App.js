import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [msg, setmsg] = useState();
  const [status, setstatus] = useState(false);
  const [emailList, setemailList] = useState([]);

  function handlemsg(evt) {
    setmsg(evt.target.value);
  }

  function handlefile(event) {
    const file = event.target.files[0];

    console.log(file);

    const reader = new FileReader();

    reader.onload = function (event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const totalemailList = emailList.map(function (item) {
        return item.A;
      });
      setemailList(totalemailList);
    };

    reader.readAsBinaryString(file);
  }

  function send() {
    setstatus(true);
    axios
      .post("http://localhost:5000/sendemail", { msg: msg, emailList:emailList})
      .then(function (data) {
        if (data.data === true) {
          alert("Email Sent Successfully");
          setstatus(false);
        } else {
          alert("Failed");
        }
      });
  }

  return (
    <div className="m-20 border-2 border-black rounded-2xl">
      <div className=" bg-blue-950 text-white text-center rounded-t-2xl">
        <h1 className="text-3xl font-medium p-5">Bulk Mail</h1>
      </div>

      <div className=" bg-blue-800 text-white text-center">
        <h1 className="text-xl font-medium p-5">
          We can help your business with sending multiple emails at once
        </h1>
      </div>

      <div className=" bg-blue-600 text-white text-center">
        <h1 className="text-xl font-medium  p-5">Drag an Drop</h1>
      </div>

      <div className=" bg-blue-400 flex flex-col text-center text-black px-5 py-3">
        <textarea
          onChange={handlemsg}
          value={msg}
          className="h-32 py-2 outline-none border border-black rounded-md "
          placeholder="  Enter mail Content "
        ></textarea>

        <div>
          <input
            onChange={handlefile}
            type="file"
            className="border-4 border-dashed py-3 px-4 m-5 w-64 text-center"
          />
          <p>Total email in the file : {emailList.length}</p>
        </div>

        <div className=" text-white text-center">
          <button
            onClick={send}
            className="bg-blue-950 text-white py-2 rounded-md px-5 font-medium  "
          >
            {status ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      <div className=" bg-blue-300 text-white text-center">
        <h1 className="text-xl font-medium  p-3">- </h1>
      </div>

      <div className=" bg-blue-200 text-white text-center  rounded-b-2xl">
        <h1 className="text-xl font-medium  p-3"> - </h1>
      </div>
    </div>
  );
}

export default App;
