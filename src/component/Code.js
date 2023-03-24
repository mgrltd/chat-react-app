import React, { useState } from 'react'


const Code = () => {

  const [code, setCode] =useState('');
const [output, setOutput] = useState('');

const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     // const res = await axios.post('/compile', { code });
//     // setOutput(res.data);
//   } catch (err) {
//     setOutput(err.message);
//   }
 };

  return (
    <div>
      <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="code">Java code:</label>
        <textarea id="code" value={code} onChange={(e) => setCode(e.target.value)} />
        <button type="submit">Compile</button>
      </form>
      <pre>{output}</pre>
    </div>

    </div>
  )
}

export default Code