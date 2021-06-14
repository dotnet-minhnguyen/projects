
import React from 'react'
import { loremIpsum } from 'lorem-ipsum'
const RenderRow = React.lazy(() => import('./RenderRow'))
import LazyLoad from 'react-lazyload'

export default class BigImages extends React.Component {

	state = {
	  list: []
	}

	componentDidMount() {
	  const list: any[] = []
	  let len = 12

	  while (len--) {
	    const item = {
	      id: len,
	      name: 'John Doe',
	      image: 'https://via.placeholder.com/40',
	      text: loremIpsum({
	        count: 1,
	        units: 'sentences',
	        sentenceLowerBound: 4,
	        sentenceUpperBound: 8
	      })
	    }
	    list.push(item)
	  }
		
	  this.setState({ list })
	}

	render() {
	  return (
	  // <div className="list">
	  // 	{
	  // 		this.state.list.map((item: any) => (
	  // 			<LazyLoad key={item.id}>
	  // 				<RenderRow item={item} />
	  // 			</LazyLoad>
	  // 		))
	  // 	}
	  // </div>

			

	    <div className="grid">
	      {
	        this.state.list.map((item: any) => (
	                    <div key={item.id} className="grid-col">
	                        <LazyLoad >
	                            <RenderRow item={item} />
	                        </LazyLoad>
	                    </div>
	        ))
	      }
	    </div>
	  )
	}
}