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
// createElement的作用是返回一个虚拟的节点
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
    // 类名，为什么要将className改成class
    if ( name === 'className' ) name = 'class';
    // 如果属性名是onXXX，则是一个时间监听方法
    if ( /on\w+/.test( name ) ) {
        // 在原声js中事件名都是小写的，所以转换成为小写
        name = name.toLowerCase();
        // 设置属性的值
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
            // 这里的setAttribute是dom节点自身提供的方法
            dom.setAttribute( name, value );
        } else {
            // 这里的removeAttribute是dom节点自身提供的方法
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
    console.log(element, 'element');
    ReactDOM.render(
        element,
        document.getElementById( 'root' )
    );
}

tick();


// 问题一：在下边的代码中并没有用到React为什么要import呢？
// import React from 'react';    
// import ReactDOM from 'react-dom';
// ReactDOM.render( <App />, document.getElementById( 'editor' ) );  */
// 答： 也没有使用React还要引入因为React中提供可createElement的方法。即节点转换为虚拟的节点。

// 问题二： ReactDOM.render()中是什么时候调用createElement方法的？？？？或者是怎么调用的？在代码中没有看到调用的方法
// 答：是存在jsx语法的时候将babel转移过的代码作为参数传递为createElement，每个jsx都是调用createElement的语法糖，并且不必显式的调用。
// 这里的额parcel的功能是提供了babel，server+打包的功能。

// 问题三：DOM节点的属性 VS 标签的属性
// 答： (1)所属不同，DOM节点的属性是js对象，标签属性是HTML的属性。
//  （2）DOM节点和标签节点中都有属性，DOM节点中叫property，标签中的为attribute
// （3）<div id='root' title='test'></div> 这个里边的id title是标签的属性，DOM提供了getAttribute，setAttribute的方法获取HTML标签的属性
// （4）两者有些属性是相同的，有些是不一致的；例如input中的value值，通过getAttribute获取的是设置标签时设置的值，value值是输入框输入的值。

// 问题四：className vs class的区别，解释为什么要将className转换为class??
// 答：className是js中DOM节点的类名，因为class在js中是关键字。class是HTML标签中特有的属性

// 问题五：事件监听，通过什么机制绑定到真实的DOM上的呢？？？ 组件销毁的时候，删除事件是怎么处理的呢？？？？
// 答： 通过addEventListener事件添加或者通过document.body.onClick直接添加。组件销毁的时候，删除事件是由浏览器做处理的，除了一些比较旧的浏览器不会做。

// 总结：（1）React提供的createElement方法，目的是将节点转换为虚拟节点
// （2）ReactDom提供的render方法是将虚拟节点转换为真实的节点。