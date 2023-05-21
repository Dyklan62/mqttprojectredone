import HomePage from './Pages/HomePage.jsx'
import { Context} from "./AppContext.jsx"
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {
  return (
    <Context>
      <HomePage/>
    </Context>
  )
}

export default App
