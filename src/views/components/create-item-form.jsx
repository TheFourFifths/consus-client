import React from 'react';
import ListenerComponent from '../../lib/listener-component.jsx';
import ModelStore from '../../store/model-store';
import ItemFormController from '../../controllers/components/create-item-form';

export default class CreateItemForm extends ListenerComponent {

    getStores() {
        return [
            ModelStore
        ];
    }

    getState() {
        return {
            model: null,
            models: ModelStore.getAllModels()
        };
    }

    changeModel(e) {
        this.setState({
            model: ModelStore.getModelByAddress(e.target.value)
        });
    }

    submit(e) {
        e.preventDefault();
        if (!this.state.model) {
            ItemFormController.popNoModelSelectedToast();
        } else {
            ItemFormController.createItem(this.state.model.address);
        }
    }

    renderDescription() {
        return this.state.model.description.split(/[\r\n]/g).map((line, index) => {
            return <span key={index}>{line}<br/></span>;
        });
    }

    renderModelPreview() {
        if(this.state.model){
            return (
                <div className='model-preview'>
                    <img src={`data:image/jpeg;base64,${this.state.model.photo}`}/>
                </div>
            );
        }
    }

    render() {
        return (
            <div className='create-item-form'>
                <h1>Create an Item</h1>
                <form onSubmit={this.submit.bind(this)}>
                    <select defaultValue='default' onChange={this.changeModel.bind(this)} >
                        <option value='default' disabled>Choose a Model</option>
                        {this.state.models.map((model, key) => {
                            if(!model.allowCheckout) {
                                return <option key={key} value={model.address}>{ model.name }</option>;
                            }
                        })}
                    </select><br/>
                    {this.renderModelPreview()}
                    <input className='cool-button' type='submit' value='Create Item' />
                </form>
            </div>
        );
    }

}
