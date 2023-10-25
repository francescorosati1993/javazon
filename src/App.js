import React from "react"
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from "./navbar/Navbar";
import Prodotti from "./products-component/Prodotti";
import $ from "jquery";
import SpecificFilter from "./filter-component/SpecificFilter";
import Carrello from "./carrello-component/Carrello";
import Ordini from "./ordini-component/Ordini";

class App extends React.Component
{
    componentDidMount()
    {
        if(localStorage.getItem('token'))
            $.ajaxSetup({
                headers:{"Authorization":"Bearer "+localStorage.getItem('token')}
            }); 
        //imposto(allego) il token alla request leggendolo da db interno al browser

        $.getJSON("prodotti", (data) => 
        {
            const maxP = this.MaxPrice(data);
            this.setState({loaded:true, prodotti:data, maxP:maxP, priceRange:[0,maxP]}); 
        }).fail(() =>  {this.setState({needLogin:true});  $.ajaxSetup({
            headers:{"Authorization":""}
        }); });

        //leggete anche il CLIENTE, tanto avete lo username in localstorage
        //Fate funzionare il sito in generale
        //aggiungete un pulsantino di LOGOUT, che deve cancellare da localstorage token e username
        //e refreshare la pagina
        
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
                        tempCredentials:{},
                        loaded:false,
                        search: '',
                        categories: [],
                        prodotti:[],
                        aggiunto: false,
                        rimosso: false,
                        nuoviProdotti:[],
                        user:[],
                        ordini:[]
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
        let tempCredentials = this.state.tempCredentials;
        tempCredentials[e.target.name] = e.target.value;
        this.setState({tempCredentials: tempCredentials});
    }

    handleSubmit = (e) =>
    {
        // let buongiorno = new Audio("/buongiorno.mp3");

        // buongiorno.play();
        
        // for(let i=0; i<10; i++)
        // setTimeout(() => {buongiorno.play()}, i*1500);

        e.preventDefault();

        var settings = {
            "url": "http://localhost:8080/authenticate",
            "method": "POST",
            "timeout": 0,
            "data": JSON.stringify(this.state.tempCredentials),
            "headers": {
            "Content-Type": "application/json"
            }
        };
        
        $.ajax(settings).done(responseConToken => {
            //come response riceviamo il TOKEN
            localStorage.setItem("token",responseConToken.token);
            localStorage.setItem("username",this.state.tempCredentials.username);
            window.location.reload();//come se l'utente cliccasse su aggiorna
            // this.setState({user: response});
            // $.getJSON("clienti/"+ response.id, (data) => 
            // {
            //     this.setState({ordini: data.ordini}); 
            // });
        })
    }

    notificaAcquisto = (ordine) =>
    {
        this.setState({ordini: [...this.state.ordini, ordine]});
    }


    render()
    {
        if(this.state.needLogin)
            return (
                <div>
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" name="username" placeholder="Inserisci Username" onChange={this.handleChange}/>
                            <input type="text" name="password" placeholder="Inserisci password" onChange={this.handleChange}/>
                            <input type="submit" value="Accedi" />
                        </form>
                    </div>



                </div>
            );

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
              <Navbar search={search} handleSearchChange={this.handleSearchChange}  />
                <div className="row m-5">
                    
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
                        <Carrello addToCart={this.addToCart} removeToCart={this.removeToCart} nuoviProdotti={this.state.nuoviProdotti} user = {this.state.user} notificaIdCarrello={this.notificaIdCarrello} aggiunto={this.state.aggiunto} aggiuntoFalse={this.aggiuntoFalse} rimosso={this.state.rimosso} rimossoFalse={this.rimossoFalse} notificaAcquisto={this.notificaAcquisto}></Carrello>
                    </div>
                </div>
                <Ordini ordini={this.state.ordini}></Ordini>
            </div>
        );

    }


}

export default App;
