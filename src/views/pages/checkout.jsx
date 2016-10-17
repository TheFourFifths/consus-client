import Item from '../components/item.jsx';
import Student from '../components/student.jsx';

export default class Checkout extends ListenerComponent {

    constructor() {
        super();
    }

    getStores() {
        return [
            StudentStore
        ];
    }

    getState() {
        return {
            student: StudentStore.getStudent(),
        };
    }

    render() {
        return (
            <div id='index'>
                <CheckOutForm />
                <Student student={this.state.student} />
            </div>
        );
    }

}
