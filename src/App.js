import React from "react"
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from "./navbar/Navbar";
import Prodotti from "./products-component/Prodotti";
import $ from "jquery";
import SpecificFilter from "./filter-component/SpecificFilter";

class App extends React.Component
{
    componentDidMount()
    {
        $.getJSON("prodotti", (data) => 
        {
            const maxP = this.MaxPrice(data);
            this.setState({loaded:true, prodotti:data, maxP:maxP, priceRange:[0,maxP]}); 
            console.log(data)
        });
    }

    MaxPrice(p) 
    {
        return p.reduce((max, product) => {
          return Math.max(max, product.prezzo);
        }, 0);
    }

    constructor(props)
    {
        super(props);
        this.state = {  
                        loaded:false,
                        search: '',
                        categories: [],
                        prodotti:[]
                    };

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handlePriceRangeChange = this.handlePriceRangeChange.bind(this);

    }

    //Prende le categorie direttamente dai prodotti
    getCategoryOptions() 
    {
        const { prodotti } = this.state;
        const uniqueCategories = [...new Set(prodotti.map((product) => product.tipologia))];
        return uniqueCategories;
    }


    handleSearchChange(event) 
    {
        this.setState({ search: event.target.value });
        console.log("Valore di ricerca:", this.state.search);
    }

    handleCategoryChange(category) 
    {
        const { categories } = this.state;

        if (categories.includes(category)) 
        {
          // Rimuovi la categoria selezionata
          const updatedCategories = categories.filter((cat) => cat !== category);
          this.setState({ categories: updatedCategories });
        } 
        else 
        {
          // Aggiungi la categoria selezionata
          this.setState((prevState) => ({
            categories: [...prevState.categories, category],
          }));
        }
      }

    handlePriceRangeChange = (event) => 
    {
        const value = parseInt(event.target.value);
        const [minPrice, maxPrice] = this.state.priceRange;

        if (event.target.name === "minPrice") {
            this.setState({ priceRange: [value, maxPrice] });
        } else if (event.target.name === "maxPrice") {
            this.setState({ priceRange: [minPrice, value] });
        }
    }
    

    render()
    {
        if(!this.state.loaded)
        return (<div></div>);

        const { search, prodotti, categories } = this.state;

        const filteredProducts = prodotti.filter((prodotto) => 
        {
            if (search !== '' && !prodotto.nome.toLowerCase().includes(search.toLowerCase())) 
                return false;
            

            if (categories.length > 0 && !categories.includes(prodotto.tipologia)) 
                return false;
              

            const price = prodotto.prezzo;
            if (price < this.state.priceRange[0] || price > this.state.priceRange[1]) 
                return false;
            

            return true;
        });

        console.log(filteredProducts);


        return (

            <div>
              <Navbar search={search} handleSearchChange={this.handleSearchChange} />
                <div className="row m-5">
                    <div className="col-3">
                        <SpecificFilter 
                            categories={this.state.categories} 
                            handleCategoryChange={this.handleCategoryChange} 
                            categoryOptions={this.getCategoryOptions()}
                            priceRange={this.state.priceRange}
                            handlePriceRangeChange={this.handlePriceRangeChange}
                            maxP={this.state.maxP}
                            >
                        </SpecificFilter>
                    </div>
                    <div className="col-6 bg-body-tertiary">
                        <Prodotti key={prodotti} prodotti={filteredProducts}></Prodotti>
                    </div>
                </div>
    
            </div>
        );

    }


}

export default App;
