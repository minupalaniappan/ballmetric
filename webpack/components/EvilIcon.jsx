import React, { PropTypes } from 'react';


const EvilIcon = React.createClass({
    displayName: "Icon",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        className: React.PropTypes.string,
        funcClick: React.PropTypes.func,
        idAttr: React.PropTypes.string
    },
    getInitialState: function () {
        return ({
            hover: false
        })
    }, 
    hoverFunc: function () {
        var initHover = this.state.hover;
        this.setState({
            hover: !initHover
        });
    },
    render: function() {
        var size    = this.props.size ? " icon--" + this.props.size : "";
        var className = this.props.className ? " " + this.props.className : "";
        var klass   = "icon icon--" + this.props.name + size + className;
            
        var name = '#'+ this.props.name + '-icon';
        var useTag = '<use xlink:href='+name+' />';
        var Icon = (
            <svg className="icon__cnt" dangerouslySetInnerHTML={{__html: useTag }}>
            </svg>
        );
        return  (
            <div className={klass} onClick={this.props.funcClick} onMouseEnter={this.hoverFunc} id={this.props.idAttr}>
            {this.wrapSpinner(Icon, klass)}
            </div>
        );
    },

    wrapSpinner: function (Html, klass) {
        if (klass.indexOf("spinner") > -1) {
            return (
                <div className="icon__spinner">{Html}</div>
            );
        } else {
            return Html;
        }
    }

});

export default EvilIcon;