import React from "react"
import 'bootstrap/dist/css/bootstrap.css';

class Ordine extends React.Component
{
    constructor(props)
    {
        super(props);
    }


    render()
    {
        return (

            <div>
            ID dell'ordine: {this.props.proprieta.id}
            </div>

        );

    }


}

export default Ordine;