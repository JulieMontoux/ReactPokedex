import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pokemon = ({ pokemon, typesData, language }) => {
  const cardStyle = {
    flexWrap: 'wrap',
    backgroundColor: '#FFA10A',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    overflow: 'hidden',
    display: 'grid',
    width: '25em',
  };

  const imageStyle = {
    width: '100%',
    height: 'auto',
    borderBottom: '1px solid #ddd',
    borderRadius: '8px 8px 0 0',
  };

  const contentStyle = {
    padding: '20px',
  };

  const h2Style = {
    marginTop: '0',
    color: '#fff',
    textAlign: 'center',
  };

  const pStyle = {
    marginBottom: '10px',
    color: '#333',
  };

  const getTypeName = (typeId) => {
    const type = typesData.find(type => type.id === typeId);
    return type ? type.name[language] : 'Inconnu';
  };

  return (
    <div style={cardStyle}>
      <img src={pokemon.image} alt={`${pokemon.name.en} sprite`} style={imageStyle} />
      <div style={contentStyle}>
        <h2 style={h2Style}>{pokemon.name[language]}</h2>
        <p style={pStyle}>ID: {pokemon.id}</p>
        <p style={pStyle}>
          Type(s): {pokemon.types.map((typeId, index) => (
            <span key={index}>{getTypeName(typeId)}{index < pokemon.types.length - 1 ? ', ' : ''}</span>
          ))}
        </p>
      </div>
    </div>
  );
};

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [typesData, setTypesData] = useState([]);
  const [language, setLanguage] = useState('en'); // Par défaut en anglais
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pokemonResponse = await axios.get('https://pokedex-api.3rgo.tech/api/pokemon', {
          headers: {
            'accept': '*/*',
            'X-CSRF-TOKEN': '',
          },
        });

        const typesResponse = await axios.get('https://pokedex-api.3rgo.tech/api/types'); 
        setPokemonList(pokemonResponse.data.data);
        setTypesData(typesResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      }
    };

    fetchData();
  }, []);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  if (error) {
    return <p>Error loading data. Please check the console for details.</p>;
  }

  if (!pokemonList || pokemonList.length === 0 || !typesData) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div style={{ marginTop: '20px', textAlign: 'right', marginRight: '100px'}}>
        <img src="https://cdn-icons-png.flaticon.com/128/8363/8363075.png" alt="English flag" onClick={() => handleLanguageChange('en')} style={{ marginRight: '10px', width: '30px' }}/>
        <img src="https://cdn-icons-png.flaticon.com/128/5921/5921991.png" alt="French flag" onClick={() => handleLanguageChange('fr')} style={{ marginRight: '10px', width: '30px' }}/>
      </div>
      <h1 style={{ textAlign: 'center', color: '#e53935', marginTop: '-20px'}}>Pokédex - Julie Montoux</h1>
      <p style={{ textAlign: 'center', color: '#e53935', marginTop: '-20px', textDecoration: 'underline'}}>Projet React</p>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {pokemonList.map(pokemon => (
          <Pokemon key={pokemon.id} pokemon={pokemon} typesData={typesData} language={language} />
        ))}
      </div>
    </>
  );
};

export default App;
