import React, { Component } from 'react'
import PropTypes from 'prop-types'
import L from 'leaflet'
import 'leaflet-vectoricon'
import InsetMap from '../../InsetMap/InsetMap'
import WithTaskCenterPoint from '../../HOCs/WithTaskCenterPoint/WithTaskCenterPoint'
import './TaskLocationMap.css'

const starIconSvg = L.vectorIcon({
  className: 'star-marker-icon',
  svgHeight: 20,
  svgWidth: 20,
  type: 'path',
  shape: {
    d: "M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
  },
  style: {
    fill: '#2281C2', // cornflower blue 
  },
})

export class TaskLocationMap extends Component {
  render() {
    return (
      <div className="task-location-map">
        <InsetMap className="task-location-map__primary-map"
                  task={this.props.task} fixedZoom={7} {...this.props} />

        <InsetMap className="task-location-map__extent-map"
                  markerIcon={starIconSvg}
                  task={this.props.task} fixedZoom={1} {...this.props} />
      </div>
    )
  }
}

TaskLocationMap.propTypes = {
  task: PropTypes.object,
}

export default WithTaskCenterPoint(TaskLocationMap)
