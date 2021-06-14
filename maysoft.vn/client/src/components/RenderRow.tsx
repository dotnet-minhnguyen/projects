import React from 'react'
import LazyLoad from 'react-lazyload'

export default class RenderRow extends React.Component<{ item: any }> {
    render() {
        return (
            <div key={this.props.item.id} className='row'>
                <div className='col-md-12'>
                    <div className='display-flex'>
                        <div className='image'>
                            <LazyLoad height={80}>
                                <img src={this.props.item.image} alt='' />
                            </LazyLoad>
                        </div>
                        <div className='content'>
                            <div className='t-14'>{this.props.item.name}</div>
                            <div className='t-12'>{this.props.item.text}</div>
                        </div> 
                    </div> 
                </div>
            </div>
        )
    }
}