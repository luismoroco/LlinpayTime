import { TimeSeries } from "./components/TS"

function App() {

  return (
    <>
      <h1> LLINPAYTIME </h1>
      <div>
        <TimeSeries width={1200} height={400} title={'PM10'} index={'1'}/>
        <TimeSeries width={1200} height={400} title={'PM10'} index={'2'}/>
      </div>
    </>
  )
}

export default App
