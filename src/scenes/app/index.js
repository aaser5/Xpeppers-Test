import React, {Component} from 'react';
import {Button, Checkbox, FormControlLabel, MenuItem, Modal, TextField} from "@material-ui/core";

class SalesTaxScreen extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    state = {
        products: [
            {
                name: '',
                quantity: 0,
                price: 0,
                category: '',
                imported: false,
                priceAfterTax: 0
            }
        ],
        openModal: false,
        salesTaxes: 0,
        total: 0,
        testSample1: [{
            name: 'book',
            quantity: 2,
            price: 12.49,
            category: 'books',
            imported: false,
            priceAfterTax: 0
        },
            {
                name: 'music CD',
                quantity: 1,
                price: 14.99,
                category: 'other',
                imported: false,
                priceAfterTax: 0
            },
            {
                name: 'chocolate bar',
                quantity: 1,
                price: 0.85,
                category: 'food',
                imported: false,
                priceAfterTax: 0
            }],
        testSample2: [{
            name: 'box of chocolates',
            quantity: 1,
            price: 10.00,
            category: 'food',
            imported: true,
            priceAfterTax: 0
        },
            {
                name: 'bottle of perfume',
                quantity: 1,
                price: 47.50,
                category: 'other',
                imported: true,
                priceAfterTax: 0
            }],
        testSample3: [
            {
                name: 'bottle of perfume',
                quantity: 1,
                price: 27.99,
                category: 'other',
                imported: true,
                priceAfterTax: 0
            },
            {
                name: 'bottle of perfume',
                quantity: 1,
                price: 18.99,
                category: 'other',
                imported: false,
                priceAfterTax: 0
            },
            {
                name: 'packet of headache pills',
                quantity: 1,
                price: 9.75,
                category: 'medical',
                imported: false,
                priceAfterTax: 0
            },
            {
                name: 'box of chocolates',
                quantity: 3,
                price: 11.25,
                category: 'food',
                imported: true,
                priceAfterTax: 0
            }
        ]
    };

    handleChange = (event, index, type) => {
        const {products} = this.state;
        if (type === 'category') {
            products[index].category = event.target.value;
        } else if (type === 'imported') {
            products[index].imported = !products[index].imported;
        } else if (type === 'name') {
            products[index].name = event.target.value;
        } else if (type === 'price') {
            products[index].price = parseFloat(event.target.value);
        } else {
            products[index].quantity = parseFloat(event.target.value);
        }

        this.setState({products});
    };
    addProduct = (e) => {
        const {products} = this.state;
        e.preventDefault();
        products.push({
            name: '',
            quantity: 0,
            price: 0,
            category: '',
            imported: false,
            priceAfterTax: 0
        });
        this.setState({products});
    }
    removeProduct = (productIndex) => {
        const {products} = this.state;
        const newProducts = products.filter((item, index) => index !== productIndex);
        this.setState({products: newProducts});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {products} = this.state;
        let errorFound = false;
        products.map((item, index) => {
            if (!item.quantity) {
                item.quantityError = true;
                errorFound = true;
            } else {
                item.quantityError = false;
            }
            if (!item.name) {
                item.nameError = true;
                errorFound = true;
            } else {
                item.nameError = false;
            }
            if (!item.category) {
                item.categoryError = true;
                errorFound = true;
            } else {
                item.categoryError = false;
            }
            if (!item.price) {
                item.priceError = true;
                errorFound = true;
            } else {
                item.categoryError = false;
            }
        });
        this.setState({products});
        if (errorFound) {
            return;
        }
        this.taxesCalculator();
        this.setState({openModal: true});

    }

    taxesCalculator = () => {
        const {products} = this.state;
        let salesTaxes = 0;
        let total = 0;
        products.map(item => {
            item.priceAfterTax = item.price;
            if (item.category == 'other') {
                salesTaxes +=  parseFloat((Math.ceil(item.price * 0.1*20)/20).toFixed(2))  * item.quantity;
                item.priceAfterTax += parseFloat((Math.ceil(item.price * 0.1*20)/20).toFixed(2)) ;
            }
            if (item.imported) {
                item.priceAfterTax +=  parseFloat((Math.ceil(item.price * .05*20)/20).toFixed(2));

                salesTaxes += parseFloat((Math.ceil(item.price * .05 * 20)/20).toFixed(2))  * item.quantity;
            }
            total += item.priceAfterTax * item.quantity;
        });
        this.setState({products, salesTaxes, total});
    }

    handleSample =(sample)=>{
        const {testSample1, testSample2, testSample3} = this.state;
        if(sample === 1){
            this.setState({products: testSample1});
        }
        else if(sample === 2){
            this.setState({products: testSample2});
        }
        else{
            this.setState({products: testSample3});
        }
    }
    render() {
        const {products, openModal, salesTaxes, total} = this.state;
        return (
            <div>
                <h1 className='App-Title'>Sales Taxes Calculator</h1>
                <div className='samples-container'>
                    <Button variant="contained" onClick={()=> this.handleSample(1)}>Sample 1</Button>
                    <Button variant="contained" onClick={()=> this.handleSample(2)}>Sample 2</Button>
                    <Button variant="contained" onClick={()=> this.handleSample(3)}>Sample 3</Button>

                </div>
                <form onSubmit={this.handleSubmit} className='sales-tax-form' noValidate autoComplete="off">
                    {
                        products.map((item, index) => (
                            <div className='form-container' key={index}>
                                <TextField value={item.name} onChange={(e) => this.handleChange(e, index, 'name')}
                                           className='sales-input' label="Product Name"
                                           helperText={item.nameError && !item.name ? "Name field is required" : null}
                                           error={item.nameError && !item.name} required={true}/>

                                <TextField value={item.category}
                                           onChange={(e) => this.handleChange(e, index, 'category')}
                                           className='sales-input' label="Category"
                                           helperText={item.categoryError && !item.category ? "Category field is required" : null}
                                           error={item.categoryError && !item.category} required select>
                                    <MenuItem value='books'>
                                        Books
                                    </MenuItem>
                                    <MenuItem value='food'>
                                        Food
                                    </MenuItem>
                                    <MenuItem value='medical'>
                                        Medical
                                    </MenuItem>
                                    <MenuItem value='other'>
                                        Other
                                    </MenuItem>
                                </TextField>
                                <div className='row-inputs'>
                                    <TextField value={item.price}
                                               onChange={(e) => this.handleChange(e, index, 'price')}
                                               className='sales-input' label="Price" min={1}
                                               error={item.priceError && !item.price}
                                               helperText={item.priceError && !item.price ? "Price has to be more than 0 " : null}
                                               required type='number'/>
                                    <TextField value={item.quantity}
                                               onChange={(e) => this.handleChange(e, index, 'quantity')}
                                               className='sales-input' label="Quantity" min={1}
                                               error={item.quantityError && !item.quantity}
                                               helperText={item.quantityError && !item.quantity ? "Quantity has to be more than 0 " : null}
                                               required type='number'/>
                                </div>
                                <FormControlLabel
                                    className='check-box-container'
                                    control={
                                        <Checkbox
                                            checked={item.imported}
                                            onChange={(e) => this.handleChange(e, index, 'imported')}
                                            name="checkedB"
                                            color="primary"
                                        />
                                    }
                                    label="Imported"
                                />
                                {index ?
                                    <Button type='button' onClick={() => this.removeProduct(index)} color="secondary">Remove
                                        product</Button> : null}
                            </div>
                        ))
                    }
                    <div className='buttons-container'>
                        <Button variant="contained" onClick={this.addProduct}>Add another product</Button>

                        <Button variant="contained" type='submit' color="primary">Calculate</Button>
                    </div>
                </form>
                <Modal
                    open={openModal}
                    onClose={() => this.setState({openModal: false})}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <div className='modal-body'>
                        <div>
                            {products.map((item, index) => (
                                <p key={index}>{item.quantity} {item.imported ? 'imported ' : ''} {item.name} : {(item.priceAfterTax * item.quantity).toFixed(2)} </p>
                            ))}

                        <label>Sales Taxes: {(Math.ceil(salesTaxes*20)/20).toFixed(2)}</label>
                            <div>
                        <label>Total: {total}</label>
                            </div>
                        </div>
                        <Button variant="contained" type='button' onClick={() => this.setState({openModal: false})}
                                color="secondary">Close</Button>

                    </div>
                </Modal>
            </div>
        )
    }
}

export default SalesTaxScreen;
