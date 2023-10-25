import React from "react"
import 'bootstrap/dist/css/bootstrap.css';
import $ from "jquery";
import Prodotto from "../products-component/Prodotto";

class Carrello extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = {
            loaded: false, 
            prodotti:[],
            nuoviProdotti: [],
            nuovaListaProdotti: props.nuoviProdotti,
            ordineInviato: false
        };
 
    }

    componentDidUpdate(prevProps, prevState) 
    {
        if(prevProps.user !== this.props.user || prevState.ordineInviato !== this.state.ordineInviato)
        {
            let idCliente = this.props.user.id;

            $.getJSON("clienti/" + idCliente + "/carrello", (data) => 
            {
                this.setState({loaded:true, ordine:data, prodotti: data.prodotti, nuovaListaProdotti: data.prodotti}); 
                this.props.notificaIdCarrello(data.id);
            });

            this.setState({ordineInviato:false});
        }

        if (prevProps.aggiunto !== this.props.aggiunto) 
        {
            this.setState({loaded: true, nuovaListaProdotti: this.props.nuoviProdotti});
            
            this.props.aggiuntoFalse();
        }

        if (prevProps.rimosso !== this.props.rimosso) 
        {
            this.setState({loaded: true, nuovaListaProdotti: this.props.nuoviProdotti});
            
            this.props.rimossoFalse();
        }
    }


    togliDoppioni(prodotti)
    {
        const prodottiConQuantita = [];

        prodotti.forEach((prodotto) => {
            const prodottoId = prodotto.id;
            const esistente = prodottiConQuantita.find(item => item.id === prodottoId);
            if (esistente) 
                esistente.quantita += 1;
            else 
                prodottiConQuantita.push({ ...prodotto, quantita: 1 });
        });

        return prodottiConQuantita;
    }


    acquista = () => 
    {
        var settings = {
            "url": "ordini/" + this.state.ordine.id,
            "method": "POST",
            "timeout": 0,
            "headers": {
            "Content-Type": "application/json"
            }
          };
          
        $.ajax(settings).done((response) => {
            this.setState({ordineInviato: true})
            
            this.props.notificaAcquisto(this.state.ordine);

        }).fail(()=>this.setState({error:true})); 
    }



    render() {

        if(!this.props.user.nome)
        return (<div>EFFETTUA IL LOGIN</div>);


        if(!this.state.loaded)
        return (<div>ASPETTA IL CARICAMENTO DATI</div>);
        
        let {nuovaListaProdotti} = this.state;

        
        return (
            <div>
                <div>
                <h1 className="text-center">Carrello</h1>
                <h2>Prodotti:</h2>
                {nuovaListaProdotti.map(prodotto => <Prodotto key={prodotto.id} carrello={true} ordineId={this.state.ordine.id} proprieta={prodotto} addToCart={this.props.addToCart} removeToCart={this.props.removeToCart} ></Prodotto>)}
                </div>
                <div className="mt-5">
                    <button className="btn btn-success" onClick={this.acquista}>Acquista</button>
                </div>
            </div>

        );

    }


}

export default Carrello;