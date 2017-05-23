# How to use Data Stack for real time chat with ZetaPush

<span style="font-weight: 400;">In this tutorial we will simulate two users who wish to exchange messages.</span>

# Before we get started

Before you go through this tutorial, you should have at least a basic understanding of Ionic 3 concepts. You must also already have Ionic 3 set up on your machine. If you’re not familiar with Ionic 3 already, I’d recommend reading my [Getting started with ZMS and Ionic 3](https://www.why-me.tech/getting-started-with-ionic-3-and-zms/) first to get up and running and understand the basic concepts. Or [Configure your work environment for ZMS](https://www.why-me.tech/configure-your-work-environment-for-zms/)

# Configure your service 

<span style="font-weight: 400;">In the recipe.zms file you need to configure your stack service :</span>

<pre class="prettyprint">service stack = stack('my_stack');</pre>

# MacroScripts

<span style="font-weight: 400;">To use this service you need some macroscripts :</span>

<pre class="prettyprint">macroscript stackPush(string msg)
{

var result = stack.push({
	'stack' : 'my_stack',
	'data' : { 'Message' : msg }
}) loud;

var guid = result.guid;

} return { guid }</pre>

<span style="font-weight: 400;">This first macroscript adds a message into the personal stack of the owner.</span> <span style="font-weight: 400;">Pay attention to the</span> _<span style="font-weight: 400;">loud</span>_ <span style="font-weight: 400;">keyword!</span> _<span style="font-weight: 400;">loud</span>_ <span style="font-weight: 400;">will make the stack.push notification propagate outside of the macroscript.</span>  

<pre class="prettyprint">macroscript stackSetListeners()
{
// Add user 1 to listen the stack of user 2
	stack.setListeners({
		'stack' : 'my_stack',
		'listeners' : [
			__userKey,
			'iib6q5j1dk3wYasPPRRGxA'
		],
		'owner':'EToOV-sZ_CfO7ZCw8xMzYA'
	});
// Add user 2 to listen the stack of user 1
	stack.setListeners({
 		'stack' : 'my_stack',
 		'listeners' : [
 			__userKey,
 			'EToOV-sZ_CfO7ZCw8xMzYA'
 		],
 		'owner':'iib6q5j1dk3wYasPPRRGxA'
 });
}</pre>

<span style="font-weight: 400;">The macroscript</span> <span style="font-weight: 400;">stackSetListeners</span> <span style="font-weight: 400;">gives permissions to users to get notifications from a stack.</span>

<pre class="prettyprint">'EToOV-sZ_CfO7ZCw8xMzYA' = User 2</pre>

<pre class="prettyprint">'iib6q5j1dk3wYasPPRRGxA' = User 1</pre>

<span style="font-weight: 400;">Replace the two user keys by yours.</span> <span style="font-weight: 400;">Now your first user can send a message and the second user can receive a notification with the message.</span>  

# Application

<span style="font-weight: 400;">In your app ( in this case Ionic 3 ) you need to call macroscript and stack.</span> MacroScripts :

<pre class="prettyprint">import { services } from 'zetapush-js';

export class StackProvider extends services.Macro {

  stackPush(msg)
  {
    this.$publish('stackPush',{msg});
  }
  stackSetListeners()
  {
    this.$publish('stackSetListeners',{});
  }

}</pre>

<pre class="prettyprint">    private stackService = this.client.getInstance().createAsyncMacroService({
        Type: StackProvider
    }) as StackProvider;</pre>

<pre class="prettyprint">    sendMsg() {
        this.stackService.stackPush(this.msg).then((result) => {
            this.msg ="";
        }).catch((error) => {
            console.error(error);
        })
    }</pre>

  Data Stack :

<pre class="prettyprint">import { services } from 'zetapush-js';
.....
...
var self = this;
                var stackService2 = this.client.getInstance().createService({
                    Type: services.Stack,
                    listener: {
                      push(message) {self.tabs.unshift(message.data.data.Message)
                      console.log(self.tabs)}
                    }
                });</pre>
