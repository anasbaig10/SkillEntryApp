import React, { useState } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [skills, setSkills] = useState([]);
  const [users, setUsers] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/users');
      setUsers(response.data);
    } catch (error) {
      console.error("There was an error fetching the users!", error);
    }
  };

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/skills');
      const skillsOptions = response.data.map(skill => ({ value: skill, label: skill }));
      setOptions(skillsOptions);
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the skills!", error);
      setLoading(false);
    }
  };

  const handleSkillsChange = (newValue, actionMeta) => {
    setSkills(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const skillsArray = skills.map(skill => skill.value);
    try {
      const response = await axios.post('http://localhost:5001/users', {
        name,
        skills: skillsArray
      });
      setName('');
      setSkills([]);
      fetchUsers();
    } catch (error) {
      console.error("There was an error submitting the form!", error);
    }
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Enter Skills</h1>
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Name" 
            required 
          />
          <CreatableSelect
            isMulti
            onChange={handleSkillsChange}
            options={options}
            value={skills}
            placeholder="Skills (type to search)"
            onFocus={fetchSkills}
            isLoading={loading}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <h2>View Data</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            <strong>{user.name}</strong>: {user.skills.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
