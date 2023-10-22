import React from "react"
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from "./navbar/Navbar";
import Prodotti from "./products-component/Prodotti";
import $ from "jquery";
import SpecificFilter from "./filter-component/SpecificFilter";
import Carrello from "./carrello-component/Carrello";

class App extends React.Component
{
    componentDidMount()
    {
        $.getJSON("prodotti", (data) => 
        {
            const maxP = this.MaxPrice(data);
            this.setState({loaded:true, prodotti:data, maxP:maxP, priceRange:[0,maxP]}); 
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
                        prodotti:[],
                        aggiunto: false,
                        rimosso: false,
                        nuoviProdotti:[],
                        username:'',
                        user:[]
                    };

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handlePriceRangeChange = this.handlePriceRangeChange.bind(this);

    }

    aggiuntoFalse = () =>
    {
        this.setState({aggiunto:false});
    }

    
    rimossoFalse = () =>
    {
        this.setState({rimosso:false});
    }

    notificaIdCarrello = (idCarrello) => 
    {
        this.setState({idOrdine: idCarrello});
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
    

    addToCart=(idProdotto) =>
    { 
        var settings = {
            "url": "ordini/"+ this.state.idOrdine +"/prodotti/" + idProdotto,
            "method": "POST",
            "timeout": 0,
            "headers": {
            "Content-Type": "application/json"
            }
          };
          
        $.ajax(settings).done((response) => {
            this.setState({aggiunto: true, nuoviProdotti: response});
        }).fail(()=>this.setState({error:true})); 
    }

    removeToCart = (idProdotto) =>
    { 
        var settings = {
            "url": "ordini/"+ this.state.idOrdine +"/prodotti/" + idProdotto,
            "method": "DELETE",
            "timeout": 0,
            "headers": {
            "Content-Type": "application/json"
            }
          };
          
          $.ajax(settings).done( (response) => {
            this.setState({rimosso: true, nuoviProdotti: response});
            
          }).fail(()=>this.setState({error:true}));
    }

    handleChange = (e) =>
    {
        let username = e.target.value;
        this.setState({username: username});
    }

    handleSubmit = (e) =>
    {
        e.preventDefault();

        var settings = {
            "url": "/clienti/"+this.state.username,
            "method": "POST",
            "timeout": 0,
            "headers": {
            "Content-Type": "application/json"
            }
        };
        
        $.ajax(settings).done(response => {
            this.setState({user: response});
        });

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



        return (

            <div>
              <Navbar search={search} handleSearchChange={this.handleSearchChange} />
                <div className="row m-5">
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" name="username" placeholder="Inserisci Username" onChange={this.handleChange}/>
                            <input type="submit" value="Accedi" />
                        </form>
                    </div>

                    <div>Benvenuto {this.state.user.nome} {this.state.user.cognome}</div>
                    <div  className="col-3 border border-dark rounded">
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
                        <Prodotti prodotti={filteredProducts} addToCart={this.addToCart}></Prodotti>
                    </div>

                    <div className="col-3 border border-dark rounded">
                        <Carrello addToCart={this.addToCart} removeToCart={this.removeToCart} nuoviProdotti={this.state.nuoviProdotti} user = {this.state.user} notificaIdCarrello={this.notificaIdCarrello} aggiunto={this.state.aggiunto} aggiuntoFalse={this.aggiuntoFalse} rimosso={this.state.rimosso} rimossoFalse={this.rimossoFalse}></Carrello>
                    </div>
                </div>
    
            </div>
        );

    }


}

export default App;
