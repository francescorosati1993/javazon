import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      categories: [],
      priceRange: [0, 1000],
    };
  }

  handleSearchChange = (e) => {
    this.setState({ search: e.target.value });
  };

  handleCategoryChange = (category) => {
    const { categories } = this.state;
    if (categories.includes(category)) {
      this.setState({
        categories: categories.filter((c) => c !== category),
      });
    } else {
      this.setState({
        categories: [...categories, category],
      });
    }
  };

  handlePriceRangeChange = (e) => {
    this.setState({
      priceRange: [parseInt(e.target.value), this.state.priceRange[1]],
    });
  };

  render() {
    const { search, categories, priceRange } = this.state;
    const products = [
      { name: 'Prodotto 1', category: 'Elettronica', price: 50 },
      { name: 'Prodotto 2', category: 'Cura del corpo', price: 30 },
      { name: 'Prodotto 3', category: 'Elettronica', price: 70 },
      // Aggiungi altri prodotti qui
    ];

    const filteredProducts = products.filter((product) => {
      if (search !== '' && !product.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      if (categories.length > 0 && !categories.includes(product.category)) {
        return false;
      }

      const price = product.price;
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }

      return true;
    });

    return (
      <div>
        <h1>Ricerca Prodotti</h1>

        {/* Input di ricerca */}
        <input
          type="text"
          placeholder="Cerca per nome"
          value={search}
          onChange={this.handleSearchChange}
        />

        {/* Filtri categorie */}
        <div>
          <h3>Categorie</h3>
          <label>
            <input
              type="checkbox"
              value="Elettronica"
              checked={categories.includes('Elettronica')}
              onChange={() => this.handleCategoryChange('Elettronica')}
            />
            Elettronica
          </label>
          <label>
            <input
              type="checkbox"
              value="Cura del corpo"
              checked={categories.includes('Cura del corpo')}
              onChange={() => this.handleCategoryChange('Cura del corpo')}
            />
            Cura del corpo
          </label>
          {/* Aggiungi più categorie qui */}
        </div>

        {/* Filtro prezzo */}
        <div>
          <h3>Filtra per Prezzo: ${priceRange[0]} - ${priceRange[1]}</h3>
          <input
            type="range"
            min="0"
            max="100"
            value={priceRange[0]}
            onChange={this.handlePriceRangeChange}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={priceRange[1]}
            onChange={(e) =>
              this.setState({ priceRange: [priceRange[0], parseInt(e.target.value)] })
            }
          />
        </div>

        {/* Visualizzazione dei risultati */}
        <div>
          <h2>Risultati</h2>
          <ul>
            {filteredProducts.map((product, index) => (
              <li key={index}>{product.name} - Categoria: {product.category} - Prezzo: ${product.price}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;