//  React提供了creatElement方法
const React = {
    createElement
}
//  ReactDOM提供了render方法，接收的是creatElement返回的虚拟的DOM
const ReactDOM = {
    render: ( vnode, container ) => {
        //  渲染前清空container
        container.innerHTML = '';
        // 返回一个render函数
        return render( vnode, container );
    }
}
// 接收三个参数，第一个参数是标签名称，第二个参数是属性对象，第三个参数是子节点数组
// 这个方法是用于将jsx的语法变成js的语法，这个是虚拟的DOM
function createElement( tag, attrs, ...children ) {
    return {
        tag,
        attrs,
        children
    }
}
// render方法的作用是将虚拟的节点渲染成真实的节点。
function render( vnode, container ) {
    //  文本，直接生成真实节点
    if ( typeof vnode === 'string' ) {
        let textNode = document.createTextNode( vnode );
        return container.appendChild( textNode );
    }
    // 非文本，判断并添加属性
    const dom = document.createElement( vnode.tag );
    if ( vnode.attrs ) {
        Object.keys( vnode.attrs ).forEach( key => {
            const value = vnode.attrs[ key ];
            setAttribute( dom, key, value );
        } );
    }

    vnode.children.forEach( child => render( child, dom ) );

    return container.appendChild( dom );
}
//  设置属性
function setAttribute( dom, name, value ) {
    // 类名，
    if ( name === 'className' ) name = 'class';
    // 如果属性名是onXXX，则是一个时间监听方法
    if ( /on\w+/.test( name ) ) {
        name = name.toLowerCase();
        dom[ name ] = value || '';
    // 如果属性名是style，则更新style对象
    } else if ( name === 'style' ) {
        if ( !value || typeof value === 'string' ) {
            dom.style.cssText = value || '';
        } else if ( value && typeof value === 'object' ) {
            for ( let name in value ) {
                // 可以通过style={ width: 20 }这种形式来设置样式，可以省略掉单位px
                dom.style[ name ] = typeof value[ name ] === 'number' ? value[ name ] + 'px' : value[ name ];
            }
        }
    // 普通属性则直接更新属性
    } else {
        if ( name in dom ) {
            dom[ name ] = value || '';
            console.log(dom[name], name, 'han');
        }
        if ( value ) {
            dom.setAttribute( name, value );
        } else {
            dom.removeAttribute( name, value );
        }
    }
}

function tick() {
    // 调用React的createElement方法生成一个虚拟的DOM
    const element = (
        <div>
            <h1 style="color: red" className="nihao" >Hello, world!</h1>
            <h2 style="color: green">It is {new Date().toLocaleTimeString()}.</h2>
        </div>
      );
    ReactDOM.render(
        element,
        document.getElementById( 'root' )
    );
}

tick();


// 问题一：在下边的代码中并没有用到React为什么要import呢？
/* import React from 'react';    
import ReactDOM from 'react-dom';
ReactDOM.render( <App />, document.getElementById( 'editor' ) );  */
