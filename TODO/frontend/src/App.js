import React from "react";
import './App.css';

class App extends React.Component{

  constructor(props)
  {
    super(props);
    this.state={
      todoList: [], 
      activeItem : {
        id: null,
        title: "",
        complete: false,
      },
      editing : false,
    }
    this.fetchTasks= this.fetchTasks.bind(this);
    this.handleChange= this.handleChange.bind(this);
    this.handleSubmit= this.handleSubmit.bind(this);
    this.getCookie= this.getCookie.bind(this);
    this.startEditing= this.startEditing.bind(this);
    this.deleteItem=this.deleteItem.bind(this);
    this.strikeunstrike=this.strikeunstrike.bind(this);

  };
  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

  componentWillMount()
  {
    this.fetchTasks()
  }

  fetchTasks()
  {
    console.log("fetching");
    fetch("http://127.0.0.1:8000/task_list/")
    .then(resp=>resp.json())
    .then(data=>
      this.setState({
        todoList: data
      })
      )
  }

  handleChange(e)
  {
      var name= e.target.name;
      var value= e.target.value;

      console.log("Name", name);
      console.log("Value", value);

      this.setState({
        activeItem: {
          ...this.state.activeItem,
          title: value
        }
      })

  }

handleSubmit(e)
{
  e.preventDefault();
  console.log(this.state.activeItem)
  var csrftoken = this.getCookie('csrftoken');

  var url="http://127.0.0.1:8000/task_create/"

  if(this.state.editing===true)
  {

    url =`http://127.0.0.1:8000/task_update/${this.state.activeItem.id}/`
    this.setState({
      editing: false
    })
  }

  fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(this.state.activeItem)
  })
  .then((resp)=>{
    this.fetchTasks()
    this.setState({
      activeItem: {
        id: null,
        title : "",
        complete: false
      }
    })
  }).catch(function(error)
  {
    console.log("Error", error);
  })
}

startEditing(task)
{
  this.setState({
    activeItem: task,
    editing: true,
  })
}

deleteItem(task)
{
  var csrftoken = this.getCookie('csrftoken');
  var url =`http://127.0.0.1:8000/task_delete/${task.id}/`
  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  }).then((resp)=>{
    this.fetchTasks()
  })

}

strikeunstrike(task)
{
  task.complete= !task.complete;

  console.log("complete? :", task.complete);
var csrftoken= this.getCookie("csrftoken");
  var url=`http://127.0.0.1:8000/task_update/${task.id}/`

  fetch(url, {
    method: 'POST',
    headers : {
      "Content-type":"application/json",
      "X-CSRFToken" : csrftoken,
    }, 
    body: JSON.stringify({"complete": task.complete, "title": task.title})
  }).then((resp)=>{
    this.fetchTasks()
  })


}
  render()
  {
    var tasks= this.state.todoList;
    var self= this
    return(
      <div className="container">
        <div className="task-container">
            <div id="form-wrapper">
                <form onSubmit={this.handleSubmit} id="form">
                    <div className="flex-wrapper">
                        <div style={{flex: 6}}>
                            <input onChange={this.handleChange} value={this.state.activeItem.title} type="text" placeholder="Add task" id="title" name="title" className="form-control shadow-none"/>
                        </div>
                        <div style={{flex: 1}}>
                            <input type="submit" className="btn" id="submit" name="Add"/>
                        </div>
                    </div>
                </form>
            </div>

            <div id="list-wrapper">
                  {tasks.map((task, index)=>
                  {
                    return (
                        <div key={index} className="task-wrapper flex-wrapper">
                          <div onClick={()=>self.strikeunstrike(task)} style={{flex: 7}}>

                            {
                              task.complete === false ? (
                                <span>{task.title}</span>
                              ) :
                            (<strike>{task.title}</strike>)
                            }
                          </div>

                          <div style={{flex: 1}}>
                            <button onClick={()=> self.startEditing(task)} className="btn btn-sm btn-success edit">Edit</button>
                          </div>

                          <div style={{flex: 1}}>
                            <button onClick={()=> self.deleteItem(task)} className="btn btn-sm btn-danger delete">Delete</button>
                          </div>
                        </div>
                    )
                  })}
            </div>
        </div>

      </div>
    )
  }
}

export default App;
