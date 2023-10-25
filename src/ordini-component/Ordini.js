import React from "react"
import 'bootstrap/dist/css/bootstrap.css';
import Ordine from "./Ordine";

class Ordini extends React.Component
{
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (

            <div>
                {this.props.ordini.map(ordine => <Ordine key={ordine.id} proprieta={ordine}></Ordine>)}
            </div>

        );

    }


}

export default Ordini;