import React, { useState } from 'react';
import ingredientes from './data/ingredientes';
import animais from './data/animais';

// Função para calcular o balanceamento de proteína e energia
const calcularBalanceamento = (ingredientesSelecionados, necessidadeAnimal, numeroAnimais, quantidadeRacao, especie) => {
  const totalEnergiaNecessaria = necessidadeAnimal.energia ;
  let totalPartesProteina = 0;
  let totalPartesEnergia = 0;

  ingredientesSelecionados.forEach(ingrediente => {
    const energiaIngrediente = especie === 'suinos' ? ingrediente.energiaSuinos : ingrediente.energiaAves; // Diferença de EM
    const partesProteina = Math.abs(ingrediente.proteina - necessidadeAnimal.proteina);
    const partesEnergia = Math.abs(energiaIngrediente - totalEnergiaNecessaria); // Usar energia total necessária
    totalPartesProteina += partesProteina;
    totalPartesEnergia += partesEnergia;
  });

  let proporcoes = ingredientesSelecionados.map(ingrediente => {
    const energiaIngrediente = especie === 'suinos' ? ingrediente.energiaSuinos : ingrediente.energiaAves; // Diferença de EM
    const proporcaoProteina = Math.abs(ingrediente.proteina - necessidadeAnimal.proteina) / totalPartesProteina;
    const proporcaoEnergia = Math.abs(energiaIngrediente - totalEnergiaNecessaria) / totalPartesEnergia; // Usar energia total necessária
    return {
      nome: ingrediente.nome,
      proporcaoFinal: ((proporcaoProteina + proporcaoEnergia) / 2) * 100 // Média das proporções
    };
  });

  const somaProporcoes = proporcoes.reduce((total, item) => total + item.proporcaoFinal, 0);
  proporcoes = proporcoes.map(item => ({
    ...item,
    proporcaoFinal: (item.proporcaoFinal / somaProporcoes) * 100,
    quantidade: (item.proporcaoFinal / 100) * quantidadeRacao // Calcular a quantidade em quilos
  }));

  return proporcoes;
};

function App() {
  const [animalSelecionado, setAnimalSelecionado] = useState('');
  const [ingredienteSelecionado, setIngredienteSelecionado] = useState('');
  const [ingredientesSelecionados, setIngredientesSelecionados] = useState([]);
  const [quantidadeRacao, setQuantidadeRacao] = useState(1); // Novo estado para quantidade de ração
  const [resultado, setResultado] = useState([]);

  const handleAnimalChange = (event) => {
    setAnimalSelecionado(event.target.value);
    setResultado([]); 
  };

  const handleIngredienteChange = (event) => {
    setIngredienteSelecionado(event.target.value);
  };

  const adicionarIngrediente = () => {
    if (ingredienteSelecionado && !ingredientesSelecionados.includes(ingredienteSelecionado)) {
      setIngredientesSelecionados([...ingredientesSelecionados, ingredienteSelecionado]);
      setIngredienteSelecionado(''); 
    } else {
      alert('Selecione um ingrediente válido que não foi adicionado ainda.');
    }
  };

  const calcular = () => {
    if (animalSelecionado && ingredientesSelecionados.length >= 2 && quantidadeRacao > 0) {
      const animal = animais.find(a => a.nome === animalSelecionado);
      const selecionados = ingredientes.filter(i => ingredientesSelecionados.includes(i.nome));
      const resultado = calcularBalanceamento(selecionados, animal, 1, quantidadeRacao, animal.especie); // Adicionei "1" como número de animais para garantir um valor numérico válido
      setResultado(resultado);
    } else {
      alert('Selecione um animal, pelo menos 2 ingredientes e insira uma quantidade de ração válida.');
    }
  };

  return (
    <div>
      <header>
        <h1>Formulador de Rações</h1>
      </header>

      <h2>Escolha o Animal</h2>
      <select value={animalSelecionado} onChange={handleAnimalChange}>
        <option value="">Selecionar</option>
        {animais.map(animal => (
          <option key={animal.nome} value={animal.nome}>
            {animal.nome}
          </option>
        ))}
      </select>

      <h2>Quantidade de Ração (em kg)</h2>
      <input
        type="number"
        value={quantidadeRacao}
        onChange={(e) => setQuantidadeRacao(Number(e.target.value))}
        min="1"
      />

      <h2>Escolha um Ingrediente</h2>
      <select value={ingredienteSelecionado} onChange={handleIngredienteChange}>
        <option value="">Selecionar</option>
        {ingredientes.map(ingrediente => (
          <option key={ingrediente.nome} value={ingrediente.nome}>
            {ingrediente.nome} 
          </option>
        ))}
      </select>
      <button onClick={adicionarIngrediente}>Adicionar Ingrediente</button>

      <h3>Ingredientes Selecionados:</h3>
      <ul>
        {ingredientesSelecionados.map(ingrediente => (
          <li key={ingrediente}>{ingrediente}</li>
        ))}
      </ul>

      <button onClick={calcular}>Calcular Balanceamento</button>

      {resultado.length > 0 && (
        <div>
          <h2>Resultado</h2>
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Ingrediente</th>
                <th>Proporção (%)</th>
                <th>Quantidade (kg)</th>
              </tr>
            </thead>
            <tbody>
              {resultado.map(item => (
                <tr key={item.nome}>
                  <td>{item.nome}</td>
                  <td>{item.proporcaoFinal.toFixed(2)}%</td>
                  <td>{item.quantidade.toFixed(2)} kg</td> {/* Adiciona a quantidade em kg */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
