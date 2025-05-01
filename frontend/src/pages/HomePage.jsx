import React, { useEffect, useState } from 'react';

const HomePage = () => {
  const [plat, setPlat] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/plats/random')
      .then((res) => res.text())
      .then((data) => setPlat(data))
      .catch((err) => console.error('Erreur :', err));
  }, []);


  return (
    <div>
      <h1>Plat du jour :</h1>
      <p>{plat}</p>
    </div>
  );
};

export default HomePage;
