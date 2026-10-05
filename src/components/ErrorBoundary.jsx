import {Component} from 'react';
// A render error in one page shows a message here instead of blanking the whole app. App remounts it per route.
export default class ErrorBoundary extends Component{state={error:null};static getDerivedStateFromError(error){return{error}}
componentDidCatch(e,info){console.error('Page crashed:',e,info)}
render(){return this.state.error?<div role="alert" className="container-x py-24 text-center"><h1 className="h-display text-3xl">Something went wrong on this page</h1><p className="mt-2 text-ink/60">{String(this.state.error.message||this.state.error)}</p></div>:this.props.children}}
