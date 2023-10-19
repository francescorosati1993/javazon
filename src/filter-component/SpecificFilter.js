import React from "react"
import 'bootstrap/dist/css/bootstrap.css';

class SpecificFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = [];
    }

    render() {

        return (

            <div>
                <h3>Categorie</h3>
                <div className="d-flex flex-column mt-3">
                    {this.props.categoryOptions.map((tipologia, index) => (
                        <label key={index}>
                            <input
                                type="checkbox"
                                value={tipologia}
                                checked={this.props.categories.includes(tipologia)}
                                onChange={() => this.props.handleCategoryChange(tipologia)}
                            />
                            {tipologia}
                        </label>
                    ))}
                </div>

                <h3>Filtra per Prezzo: ${this.props.priceRange[0]} - ${this.props.priceRange[1]}</h3>

                <input
                    type="range"
                    name="minPrice"
                    min="0"
                    max={this.props.maxP + 10}
                    value={this.props.priceRange[0]}
                    onChange={this.props.handlePriceRangeChange}
                />
                <input
                    type="range"
                    name="maxPrice"
                    min="0"
                    max={this.props.maxP + 10}
                    value={this.props.priceRange[1]}
                    onChange={this.props.handlePriceRangeChange}
                />
            </div>

        );

    }


}

export default SpecificFilter;