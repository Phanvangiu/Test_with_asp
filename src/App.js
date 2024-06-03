import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <h1>Welcome to my web</h1>
      <nav>
        <Link to="/getall">Get List Account</Link>
        <br />
        <Link to="create">Create new account</Link>
        <br />
      </nav>
      <Routes>
        <Route path="/getall" element={<GetAll />} />
        <Route path="/update/:id" element={<Update />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </div>
  );
}
function Create() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    userName: "",
    fullName: "",
    password: "",
    email: "",
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };
  const handlePost = async (event) => {
    event.preventDefault();
    const createAccountData = {
      email: formState.email,
      userName: formState.userName,
      fullName: formState.fullName,
      password: formState.password,
    };
    try {
      const response = await axios.post(
        `https://localhost:7246/api/Account`,
        createAccountData
      );
      console.log("Account created successfully:", response.data);
      navigate("/getall");
    } catch (error) {
      console.error("Error creates account:", error);
    }
  };
  return (
    <div>
      <form onSubmit={handlePost}>
        <div>
          <label htmlFor="fullName">Full Name:</label>
          <input
            id="fullName"
            name="fullName"
            value={formState.fullName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="text"
            value={formState.password}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="text"
            value={formState.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="userName">Username:</label>
          <input
            id="userName"
            name="userName"
            type="text"
            value={formState.userName}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
function GetAll() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7246/api/Account");
        setData(response.data.data);
        console.log(response.data.data.map((a) => a.id));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        // `https://localhost:7246/api/Account?id=` + { id }
        `https://localhost:7246/api/Account?id=${id}`
      );
      console.log("Delete response: " + response);
      //load lại data
      setData(data.filter((account) => account.id !== id));
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };
  return (
    <div>
      {data.map((account, index) => (
        <div key={index}>
          <span>{account.userName}</span>
          <button type="button" onClick={() => handleDelete(account.id)}>
            Delete
          </button>
          <button onClick={() => navigate(`/update/${account.id}`)}>
            Update
          </button>
        </div>
      ))}
    </div>
  );
}

function Update() {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formState, setFormState] = useState({
    id: "",
    userName: "",
    fullName: "",
    password: "",
    email: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchAccount = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `https://localhost:7246/api/Account/${id}`
          );
          const account = response.data.data;
          setSelectedAccount(account);
          setFormState({
            userName: account.userName,
            email: account.email,
            fullName: account.fullName,
            password: account.password,
          });
        } catch (error) {
          console.error("Error fetching account:", error);
          navigate("/getall");
        }
      }
    };

    fetchAccount();
  }, [id, navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const updatedAccountData = {
      id: id,
      email: formState.email,
      userName: formState.userName,
      fullName: formState.fullName,
      password: formState.password,
    };

    try {
      const response = await axios.put(
        `https://localhost:7246/api/Account`,
        updatedAccountData
      );
      console.log("Account updated successfully:", response.data);
      navigate("/getall");
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  return (
    <div>
      {selectedAccount ? (
        <form onSubmit={handleUpdate}>
          <div>
            <label htmlFor="fullName">Full Name:</label>
            <input
              id="fullName"
              name="fullName"
              value={formState.fullName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="text"
              value={formState.password}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="text"
              value={formState.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="userName">Username:</label>
            <input
              id="userName"
              name="userName"
              type="text"
              value={formState.userName}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Update</button>
        </form>
      ) : (
        <p>Loading account details...</p>
      )}
    </div>
  );
}
export default App;
