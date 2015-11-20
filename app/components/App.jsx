import AltContainer from 'alt/AltContainer';
import React from 'react';
import Lanes from './Lanes.jsx';
import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LaneStore';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend/dist/ReactDnDHTML5Backend.min';


@DragDropContext(HTML5Backend)
export default class App extends React.Component {
	render() {
		return (
		  <div>
		  	<h3>Kanban board</h3>
		  	<button className="add-lane" onClick={this.addItem}>Add lane</button>
		  	<AltContainer
		  		stores={[LaneStore]}
		  		inject={
		  			{
		  				items: () => LaneStore.getState().lanes || []
		  			}
		  		}
		  	>
		    	<Lanes />
		    </AltContainer>
		  </div>
		);
	}

	addItem() {
		LaneActions.create({name: 'New lane'});
	}
}