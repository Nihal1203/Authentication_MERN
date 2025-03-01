# Laravel Notes

php artisan

php artisan migrate

php artisan make:view --help

php artisan make:view Home

php artisan make:controller HomeController

php artisan tinker

<!-- We can directly communicate to Laravel applications -->

app\Models\User::count()

<!-- To count the total numner of rows in User Table -->

App\Models\User::factory(10)->create();

 <!-- To create dummy data -->

php artisan route:list

<!-- To list the all routes present in our application -->

php artisan make:controller SingleActionController --invokable

<!-- There can be only one controller method in SingleActioncontroller  -->

<!-- Resource controller we use to automatically geenrate CRUD operation routes  -->

php artisan make:controller Blogcontroller -r

<!-- Migration -->
<!-- Migration is version controlling system for laravel -->
<!-- Databases name must be in plural format  -->
<!-- here blogs is table name -->

php artisan make:migration create_blogs_table

<!-- Model name must be in singular format -->
<!-- Name must be in singular form and start with capital -->

php artisen make:model <model_name>

<!-- Important -->

If your migration or the table name is in plural and you create a model with the singular version of the same name , it will automatically connect.

<!-- SEEDER -->

php artisan make:seed UserSeeder

php artisan db:seed

<!-- Seeder is only used for seed default content in your database -->

Factory
php artisan make:factory MyBlogFactory
php artisan db:seed

<!-- factory are used for insert the dummy data in the database -->

<!-- UserFactory automatically refers to the UserModel -->

<!-- Add more columns to existing tables -->
 <!-- php artisan make:migration add_new_columns_to_blogs --table=blogs -->
 <!-- Write this code inside add_new_colums_to_blogs file  -->

public function up(): void
{
Schema::table('blogs', function (Blueprint $table) {
//It will create new column author after id column
$table->string('author')->nullable()->after('id');
});
}

<!-- It will create authore field after the id field and it can be nullable to avoid the conflict against the datathat we already entered in our database  -->

<!-- //Query Builder     -->
<!-- Directly works with the table does not need any kind of model -->

<!-- Steps: -->

<!-- import -->

use Illuminate\Support\Facades\DB;

<!-- ADD DATA -->

DB::table('users')->insert([
[
'name'=>'Nishant',
'email'=>'nishant@anblicks.com',
'password'=>'12345678',
],
[
'name'=>'Nihal',
'email'=>'nihal@anblicks.com',
'password'=>'12345678',
]]);

% GET DATA

<!-- $users=DB::table('users')->get(); -->

$users=DB::table('users')->where('id',3)->first();

% It will seach id=2 in users and return first value
% get method is for multiple data fetching

$users=DB::table('users')->where('id','>',1)->get();

<!-- Mutiple conditions -->

$users=DB::table('users')->where('id','>',1)->where('email','aditya@anblicks.com')->first();

<!-- UPDATE DATA -->

        DB::table('users')->where('id',1)->update([
            We can also update multiple attributes
            'name'=>'Nihal'
        ]);

<!-- DELETE DATA -->

DB::table('users')->where('id',3)->delete();

$blogs=DB::table('blogs')->select('title')->get();

$blogs=DB::table('blogs')->pluck('title');

% Feching tile and converting answer into array

$blogs=DB::table('blogs')->pluck('title')->toArray();

<!-- We are fetching title corresponding to its id -->

$blogs=DB::table('blogs')->pluck('title','id')->toArray();

dd($blogs);

<!-- IMPORTANT -->

php artisan make:model Product -m

<!-- Create model and migration in single command -->

<!-- Eloquent ORM -->
<!-- We must have model to interact with database throught the eloquent orm -->

<!-- $user=new User();
        $user->name="Arth";
        $user->email='arth@gmail.com';
        $user->password='12345';
        $user->save(); -->

/\*\*
_ The attributes that are mass assignable.
_
_ @var list<string>
_/
protected $fillable = [
'name',
'email',
'password',
];

<!-- We add proprerties in guarded which fields we don't want to be assigned by user -->

protected $guarded=['email_verified_at'];

<!-- We create scope to encapsulate the common database query logic
and it is written inside the Model
it starts with scope and must be public function  -->

<!-- Scope function inside Model -->

function scopeActive($query){
return $query->where('status',1);
}

<!-- Use of scope function inside controller -->

$blogs=MyBlog::Active()->get();
dd($blogs);

Soft delete

Make another migration file and add softdelete property into it
and then add use HasFactory;
use SoftDeletes;
in Corresponding Model;

//Soft Delete
Product::find(1)->delete();
$products=Product::all();
        $products=Product::withTrashed()->find(1);
        $products=Product::onlyTrashed()->get();
        dd($products);


//Restore
$products=Product::onlyTrashed()->find(1)->restore();
        dd($products);

//Permenent Delete
 $products=Product::withTrashed()->find(1)->forceDelete();    



 //File Storage
 <form action="{{ route('file.store') }}" method="POST" enctype="multipart/form-data"> 
  We need to add  encrypt otherwise form can't be submitted  



$file= Storage::disk('local')->put('/',$request->file('file'));
<!-- Here our file will be stored at the path(local) that is defined in config/filesystem.php
'file' is a name that we are passing throught the form and represents the file  -->

<!-- Alternative -->
$file=$request->file('file')->store('/','local');
<!-- Here local represents path that are present in our config/filesystem.php -->




<!-- Storage Link -->

php artisan storage:link
<!-- To access the file that we store in our public folder we must need to link it to the public folder(root) that are present in home directory of out project -->


<!-- Inside controller -->
<!-- Route -->
Route::get('/file-download',[FileUploadController::class,'download'])->name('file.download');

 function download(){
            return Storage::disk('public')->download('zjKu6XeQ9lzlYDxg0NF7rR53x6ESvKlv1xBtKU7f.png');
        }

<!-- view -->
 <table>
        <tbody>
            {{-- @foreach ($files as $file) --}}
               <a href={{ route('file.download') }}>Download a File</a>
            {{-- @endforeach --}}

        </tbody>

    </table>


<!-- //Create our own disk     -->
 
 <!-- php artisan storage:unlink  -->

<!-- Inside filesystem.php -->

'dir_public'=>[
                'driver' => 'local',
                'root' => public_path('uploads'),
                'url' => env('APP_URL').'/uploads',
                'visibility' => 'public',
                'throw' => false,
                'report' => false,
            ],
<!-- Inside controller -->
  $file = $request->file('file')->store('/', 'dir_public');

        $fileStore = new File();
        $fileStore->file_path ='/uploads/'.$file;
        $fileStore->save();
        dd('upload');

<!-- Download file -->
function download()
        {
            return Storage::disk('dir_public')->download('3rpCPyA6G4HQfSYSw54zfAC1ZmI1obMEir8qBtf2.png');
        } 

<!-- Custom file name  -->
$file=$request->file('file');
        $customName='laravel_'.Str::uuid();
        $ext=$file->getClientOriginalExtension();
        <!-- returns png,jpg without . -->
        $fileName=$customName.'.'.$ext; 

        $path=$file->storeAs('/',$fileName,'dir_public');

        $fileStore = new File();
        $fileStore->file_path ='/uploads/'.$path;
        $fileStore->save();
        dd('stored');

 <!-- Delete file from database and from local on delete       -->

 First delete file from the local using the path that we stored in our database 



.
-------------------------------------------------------------------------------------------------------
SECOND PROJECT


<!-- Joins -->

<!-- Eloquent ORM Relationships -->

-one to one
-one to many
-many to many
-has one through
-has many through
-polymorphic relation

<!-- One to One -->
hasOne
BelongTo

-----------------------------------------
hasOne
   Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            // Naming Convention = <modelname of that table>_<primary key of that table>
            //It will automatically connect it 
            $table->foreignId('user_id')->constrained('users');
            $table->string('country');
            $table->timestamps();
        });

<!-- Inside View -->
 <div>
        {{-- Has one Relationship  --}}
      {{-- @foreach($users as $user) --}}
      {{-- <h4>{{ $user->name }}</h4> --}}
      {{-- <p>Addresse:{{ $user->address }}</p> --}}
      {{-- <p>Address:{{ $user->address->country ?? "" }}</p> --}}
      {{-- @endforeach   --}}
    </div>        


<!-- We define all the relationship inside our Model to connect the two table. -->
function address(){
        return $this->hasOne(Address::class);
          <!-- In case if we does not follow naming convention
         return $this->hasOne(Address::class.'user_id','id'); -->
    }


<!-- Function inside User Model     -->

-------------------------------------------------

BelongsTo

<!-- Inside View -->
<div>
        @foreach($address as $address)
        <h4>{{ $address->country}}</h4>
        <p>User:{{ $address->user }}</p>
        @endforeach
    </div>


<!-- Function inside Address model -->
 function user(){
       return $this->belongsTo(User::class); 
    }


---------------------------------------------------

hasMany RelationShip

<!-- Belogns to  -->
function user(){
        return $this->belongsTo(User::class);
    }
<!-- HasMany Relationship -->
    function addresses(){
        return $this->hasMany(Address::class,'user_id','id');
    }

<!-- HasMany Relationship -->
    function posts(){
        return $this->hasMany(Post::class);
    }


      <div>
        @foreach($users as $user)
        <h4>{{$user->name}}</h4>
        <p>Post Count:{{ $user->posts->count() }}</p>
        @endforeach
    </div>

    <div>
    @foreach($posts as $post)
    <h4>{{ $post->name }}</h4>
    <p>Author:{{ $post->user->name}}</p>
    <hr>
    @endforeach
</div>  



Route::get('/users', function () {
     $users = User::all();
     $address = Address::all();
     return view('test', compact('users', 'address'));

    $users=User::all();
    return view('test',compact('users'));

});


-------------------------------------------------------------------

Many to Many 
BelongsToMany()

<!-- We can't directly use many to many relationship we need one intermidiate table to establish the relation -->

Table-1
posts 


Pivot Table(intermidiate table)
post_tag 
Naming convention= <first table name>_<second table name>
In alphabatical order


Table-2
tags 

 
<!-- Inside Post model -->
 function tags(){
        return $this->belongsToMany(Tag::class,'post_tag');
    }
    <!--'post_tag' represents pivot table   -->


-----------------------------------------------------------
belongsToMany


public function up(): void
    {
        Schema::create('post_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id');
            $table->foreignId('tag_id');
            $table->timestamps();
        });
    }



function tags(){
        return $this->belongsToMany(Tag::class,'post_tag');
    }


    function posts(){
        return $this->belongsToMany(Post::class);
    }


Route::get('/posts', function () {
    

    Tag::insert([
        [
            'name'=>'JavaScript',
        ],
        [
            'name'=>'Laravel',
        ],
        [
            'name'=>'Angular',
        ],
    ]);

    $post=Post::first();
    $tag=Tag::first();

    //Accessing the tags method written inside post model 
    // $post->tags()->attach($tag);
    // $post->tags()->attach([2,3]);

    // $post->tags()->detach([2]);
    //Delete the previous record and then add the new one 
    // $post->tags()->sync([1,3]);

    $posts=Post::all();
    return view('post',compact('posts'));
});


Route::get('tags',function(){
    $tags=Tag::all();

    return view('tag',compact('tags'));
});



----------------------------------------------------------

hasMany Through

countries
states
cities

<!-- Inside Country -->
function states(){
        return $this->hasMany(State::class);
    }

    //Country has many cities through states
    function cities(){
        return $this->hasManyThrough(City::class,State::class);
    }

<!-- Inside State -->
function cities(){
        return $this->hasMany(City::class);
    }


<!-- View -->
<body>

    <div>
        <p>{{ $country->name }}</p>
        <ul>
            @foreach($country->cities as $city)
            <li>{{ $city->name }}</li>
            @endforeach
        </ul>
    </div>
    
 <div>
   <p>{{ $country->name }}</p>
   
   <ul>
    @foreach ($country->states as $state)
    <li>{{$state->name  }}</li>
    <ul>
        @foreach($state->cities as $city)
        <li>{{ $city->name }}</li>
        @endforeach
    </ul>
    @endforeach    
   
   </ul>
 </div>

</body>


<!-- Route -->
Route::get('/location', function () {
    // $country = new Country(['name' => 'India']);
    // // $country->name='India';
    // $country->save();

    // $state = new State([
    //     'name' => 'Gujarat',
    // ]);

    // $country->states()->save($state);

    // // $city=new City([
    // //     'name'=>"Ahmedabad"
    // // ]);
    // $state->cities()->createMany([
    //     [
    //         'name' => 'Ahmedabad'
    //     ],
    //     [
    //         'name' => 'Gandhinagar'
    //     ],

    // ]);
    $country=Country::first();

    return view('location',compact('country'));
});



------------------------------------------------------
Middleware

php artisan make:middleware CheckRoleMiddleware

<!-- Overview -->

<!-- Here we haed coded the value of user_id inside form and the request first go to middleware and there we are verifying like  user inside the user table corresponding to id that we are getting from the form is admin or not if he is admin then we are passing request to controller else we are returing 403 error using abort() method -->

<!-- inside view -->
 <form action={{ route('post.store') }} method="POST">
        @csrf
        <div>
            <input type="hidden" value="3" name="user_id">
            <input type="text" name="title" id="" placeholder="title">
            <br>
            <textarea name="description" id="" cols="30" rows="10" placeholder="Description"></textarea>
            <br>
            <button type="submit">Submit</button>
        </div>
    </form>


<!-- Inside middleware -->
 public function handle(Request $request, Closure $next): Response
    {
        $user=User::findOrFail($request->user_id);
        if($user->role =='admin'){
            return $next($request);
        }
        return abort(403);
    }

<!-- Inside Controller -->
class PostController extends Controller
{
    function index(){
        //Return view(index) present in post folder 
        return view('post.index');
    }
    function store(Request $request){
        dd($request->all());
    }
}

<!-- Routes -->
Route::get('/post',[PostController::class,'index'])->name('post.index');

Route::post('/post',[PostController::class,'store'])->name('post.store')->middleware(CheckRoleMiddleware::class);


//Middleware on group routes
Route::group(['middleware'=>CheckRoleMiddleware::class],function(){
    Route::post('/post',[PostController::class,'store'])->name('post.store');
    
});


<!-- //Middleware on Controller
Steps:
1.implements HasMiddleware interface

2.Override middleware method

3.Inside that method return middleare that you want to implement on your fuction presents inside that controller

4.That middleare will be assigned to each method present inside that function

5.If you want to attach tha middleare on some specific routes then you can pass another array as argument named only in that array you can declare specific methods

6.You can pass method in except array on that specific methods middleware won't be attached

7.If you pass method in both array only and except . Except will dominate over only  -->


class PostController extends Controller implements HasMiddleware
{

    public static function middleware()
    {
        return [new Middleware(CheckRoleMiddleware::class,only:['store'],except:['index'])];
    }
    function index(){
        //Return view(index) present in post folder 
        return view('post.index');
    }
    function store(Request $request){
        dd($request->all());
    }
}



<!-- Global Middleware -->

<!-- You can use global middlware . that will be assign to each routes present inside our application -->

<!-- You can attach it at path:bootstrap/app.php -->

<!-- app.php -->
<?php

use App\Http\Middleware\CheckRoleMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
<!-- You of multiple middleware -->
        $middleware->append([TestMiddleware::class]);
        $middleware->append(CheckRoleMiddleware::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();









<!-- Authentication and Authorization -->

composer require laravel/breeze --dev
php artisan breeze:install
php artisan migrate
npm install
npm run dev

<!-- Redirect User to specific Page -->

<!-- Add this route in web.php -->

Route::get('/user/dashboard',function(){
dd('User Dashboard');
})->name('user.dashboard');

<!-- Change in AuthController -->

/\*\*
_ Handle an incoming authentication request.
_/
public function store(LoginRequest $request): RedirectResponse
{
$request->authenticate();

        $request->session()->regenerate();



<!-- // return redirect()->intended(route('dashboard', absolute: false)); -->
<!-- Here -->

        return redirect()->intended(route('user.dashboard', absolute: false));


    }

<!-- Retireving the auhenticated user  -->

Route::get('/user/dashboard',function(){
$user=Auth::user();
    if(Auth::check()){
        dd($user);
}
dd('User Dashboard');

<!-- We can also return a view  -->
<!-- return view('user-dashboard'); -->

})->name('user.dashboard');

<!-- It will show user details only when user is logged in  -->

<!-- Inside user-dashboard view -->
<body>
    @if(Auth::check())
    <h3>User Dashboard</h3>
    <p>Name: {{ auth()->user()->name }}</p>
    <p>Email: {{ auth()->user()->email }}</p>
    @endif
</body>

<!-- Recreating Logout Feature in our view . when we click on button it will logout. -->
<body>
    @if (Auth::check())
        <h3>User Dashboard</h3>
        <p>Name: {{ auth()->user()->name }}</p>
        <p>Email: {{ auth()->user()->email }}</p>
    @endif
    <form action="{{ route('logout') }}" method="post">
        @csrf
        <button type="submit">Logout</button>
    </form>
</body>

<!-- Logout route is already defined by laravel you can view it by command
 php artisan route:list  -->

 <!-- Protecting Route -->

Route::get('/user/dashboard',function(){
// $user=Auth::user();
    // if(Auth::check()){
    //     dd($user);
// }
// dd('User Dashboard');
return view('user-dashboard');
})->name('user.dashboard')->middleware('auth');

<!-- we have just added predefined middleware . means if you are not logged in you can't even see that specific page you will redirected to the login page  -->

<!-- Verify Email -->

<!-- Step-1 just implements MustVerifyEmail in User Model -->

class User extends Authenticatable implements MustVerifyEmail
{

<!-- Everything business logic will remain same  -->

}

<!-- Right now in our env file mail mapping is connected to logs file so we have to go there and verify using the link -->

<!-- .env -->

MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

<!-- In real life we can you SMTP or some other protocols -->

---

## <!-- Authorization -->

<!-- Gates -->

<!-- What we are doing here is user can only see his post not any other user's post -->

<!-- Inside Boot -->

public function boot(): void
{
Schema::defaultStringLength(191);
Gate::define('update-post',function(User $user,Post $post){
return $user->id === $post->user_id;
});
}

<!-- Route -->

Route::resource('post', PostController::class)->middleware('auth');

<!-- PostController -->
<!-- Here we have created Resource controller -->

public function index()
{
$posts=Post::all();
        <!-- It will fetch only those post that are matching with the logged in users  -->
        <!--$posts=Post::where('user_id',Auth::user()->id)->get(); -->
return view('post.index',compact('posts'));
}

public function edit(string $id)
    {
        $post=Post::find($id);

        if(! Gate::allows('update-post',$post)){
            abort(403);
        }

<!-- Alternative -->
<!-- Gate::authorize('update-post',$post); -->

        return view('post.edit',compact('post'));
    }

<!-- index view -->
<div>
    
        @foreach($posts as $post)
        <a href="{{ route('post.edit',$post->id) }}">{{ $post->title }}</a>
        <br>
        @endforeach
    </div>

-------------------------------------------

<!-- Policy -->

php artisan make:policy PostPolicy --model=Post

<!-- Inside PostPolicy -->

public function update(User $user, Post $post): bool
{
return $user->id === $post->user_id;

    }

<!-- Inside Post Controller      -->

public function edit(string $id)
    {
        $post=Post::find($id);
<!-- Here update is method that is written inside our Postpolicy -->
        Gate::authorize('update',$post);
        return view('post.edit',compact('post'));
    }


---------------------------------------------------

Verifying Authorization in Blade

<!-- index view -->
  <div>
    
        @foreach($posts as $post)
<!-- Here update is method that is written inside our PostPolicy -->
        @can('update',$post)
 <!-- {{-- Alternative --}} -->
<!-- {{-- @if(auth()->user()->can('update',$post)) --}} -->
        <a href="{{ route('post.edit',$post->id) }}">{{ $post->title }}</a>
        @endcan 
        <br>
        @endforeach
    </div>



-----------------------------------------------------------------------------------------

HTTP Response

<!-- //HTTP Responses  -->
Route::get('/post',function(){
    return redirect()->route('post.create',['user'=>'Nihal']);
    //Alternative
    // return redirect('/post/create',302);

})->name('post.index');

Route::get('/post/create',function(){
    dd(request());
    return "Post Create";
})->name('post.create');




Route::get('/post',function(){
    // return redirect()->route('post.create',['id'=>'Nihal']);
    //Alternative
    // return redirect('/post/create',302);
    //Alternative
    return to_route('post.create',['id'=>'Aditya']);

})->name('post.index');

Route::get('/post/create/{id}',function($id){
    dd($id);
    return "Post Create";
})->name('post.create');



<!-- Using Controller -->
Route::get('/post',[DemoController::class,'index'])->name('post.index');
Route::get('/post/create',[DemoController::class,'create'])->name('post.create');


class DemoController extends Controller
{
    //This controller is used for HTTP Demo Routing 
    function index()
    {
        // return redirect()->action([DemoController::class, 'create'], ['id' => 1]);
        return redirect()->away('https://www.google.com');
    }

    function create()
    {
        dd("This is a create method");
        //return redirect()->back();
    }
}


<!-- Other Response Type -->
Route::get('/post',[DemoController::class,'index'])->name('post.index');
Route::get('/post/create',[DemoController::class,'create'])->name('post.create');

//Method used for other response type
    function index()
    {
        // return response()->json([
        //     'name'=>"Nihal",
        //     'state'=>'Gujarat'
        // ]);

        // //Same
        // // return [
        // //     'name'=>"Nihal",
        // //     'state'=>'Gujarat'
        // // ];


        // return response()->download(public_path('uploads\Blockchain-LinkedList.png'));
        return response()->file(public_path('uploads\Blockchain-LinkedList.png'));
        
    }


<!-- API Response -->

php artisan install:api

<!-- Version Controll -->
php artisan make:controller Api/V1/BlogController

<!-- Make Request -->
php artisan make:request Api/V1/BlogStoreRequest
<!-- Inside Request File we provide validation Rules -->


<!-- Get Request -->
Route::group(['prefix'=>'v1'],function(){
    Route::get('/blogs',[BlogController::class,'index'])->name('blogs.index');
    Route::post('/blogs',[BlogController::class,'store'])->name('blog.create');
});

 function index(){
        $posts=Blog::all();
        return response()->json($posts,200);
    }




<!-- Post Request -->

<!-- You have to Add Accept=application/json in postman console's header -->

Route::group(['prefix'=>'v1'],function(){
    Route::get('/blogs',[BlogController::class,'index'])->name('blogs.index');
    Route::post('/blogs',[BlogController::class,'store'])->name('blog.create');
});


<!-- Inside Controller -->
function store(BlogStoreRequest $request){
        $post=new Blog();
        $post->title=$request->title;
        $post->description=$request->description;
        // $post->image=$request->image;
        $post->author_id=$request->author_id;
        $post->save();

        return response()->json($post,201);
    }

<!-- Inside BlogStoreEquest -->
public function rules(): array
    {
        return [
            'title'=>['required','max:255','string'],
            'description'=>['required','string'],
            // 'image'=>['required','image'],
            'author_id'=>['required','integer'],
        ];
    }





<!-- PUT Request -->

<!-- To Use Put method we add one more parameter in our body that we are passing throught the postman and orignally use POST  -->
<!-- _method:PUT -->

Route::group(['prefix'=>'v1'],function(){
    Route::get('/blogs',[BlogController::class,'index'])->name('blogs.index');
    Route::post('/blogs',[BlogController::class,'store'])->name('blog.create');
    Route::put('/blogs/{id}',[BlogController::class,'update'])->name('blog.update');
});


 function update(BlogStoreRequest $request, $id){
        
       $post=Blog::findOrFail($id);
       $post->title=$request->title;
       $post->description=$request->description;
       
       $post->author_id=$request->author_id;
       $post->save();

       return response()->json(['message'=>'Data Updated Successfully'],200);
    }




<!-- Get Specific Blog by id  -->
Route::group(['prefix'=>'v1'],function(){
    Route::get('/blogs',[BlogController::class,'index'])->name('blogs.index');
    Route::post('/blogs',[BlogController::class,'store'])->name('blog.create');
    Route::put('/blogs/{id}',[BlogController::class,'update'])->name('blog.update');
    Route::get('/blogs/{id}',[BlogController::class,'show'])->name('blog.getone');
});

function show($id){
        $post=Blog::findOrFail($id);
        return response()->json($post);
    }


<!-- Delete Specific Blog by id  -->
Route::group(['prefix'=>'v1'],function(){
    Route::get('/blogs',[BlogController::class,'index'])->name('blogs.index');
    Route::post('/blogs',[BlogController::class,'store'])->name('blog.create');
    Route::put('/blogs/{id}',[BlogController::class,'update'])->name('blog.update');
    Route::get('/blogs/{id}',[BlogController::class,'show'])->name('blog.getone');
    Route::delete('/blogs/{id}',[BlogController::class,'destroy'])->name('blog.destroy');
});


 function destroy($id){
        $post=Blog::findOrFail($id);
        $post->delete();

        return response()->json(['message'=>'Data Deleted Successfully'],200);
    }




<!-- Search in API -->
<!-- Using Query Parameters -->
Route::group(['prefix'=>'v1'],function(){
    Route::get('/blogs',[BlogController::class,'index'])->name('blogs.index');
    Route::post('/blogs',[BlogController::class,'store'])->name('blog.create');
    Route::put('/blogs/{id}',[BlogController::class,'update'])->name('blog.update');
    Route::get('/blogs/{id}',[BlogController::class,'show'])->name('blog.getone');
    Route::delete('/blogs/{id}',[BlogController::class,'destroy'])->name('blog.destroy');
    Route::get('/blogs-search',[BlogController::class,'search'])->name('blogs.search');
});



function search(Request $request){
        if($request->has('q')){
            $posts=Blog::where('title','like','%'.$request->q.'%')->get();
            return response()->json($posts,200);
        }
        return response()->json([],200);
    }



<!-- API Resource Controller  -->
php artisan make:controller Api/V1/TestController --resource --api

--------------------------------------------------------------------------------------------------

<!-- Caching -->

Session is User specific where Caching is Global 




Route::get('/cache',function(){
     Cache::put('post','post title-1',$seconds=5);
     $value=Cache::get('post');
     dd($value);
   
});


<!-- We are storing user details in cache so only first call will go to database next call onwards it will fetch data from cache -->

<!-- So once we cache the data and after modify it . It will not reflect because we have stored older version of data in cache and it will directly fetch the data from the cache instead of database  -->

<!-- to make reflect the changes we need to clear cache  -->
Route::get('/cache', function () {
    // Cache::put('post','post title-1',$seconds=5);
    // $value=Cache::get('post');
    // dd($value);


    // $users=User::all();
<!-- // Here we are storing users detains in cache  -->
<!-- // users is our key and corresponding data is User::all() -->
    $users = Cache::rememberForever('users', function () {
        return User::all();
    });
    return view('cache', compact('users'));
});


<!-- Delete Data from Cache -->

Route::get('/cache', function () {
    $users=null;
    // Cache::put('post','post title-1',$seconds=5);
    // $value=Cache::get('post');
    // dd($value);


    // $users=User::all();
    // Here we are storing users detains in cache 
    // users is our key and corresponding data is User::all()
    
    $users = Cache::rememberForever('users', function () {
        return User::all();
    });

    //Get data preset in cache
    // $users=Cache::get('users');

    //Delete data from cache
    // Cache::forget('users');


    if(Cache::has('users')){
        dd("Data is in cache");
    };


    // it will display data once and then Delete data from Cache
    // $users=Cache::pull('users');

    return view('cache', compact('users'));
});

----------------------------------------------------
<!-- QUEUE -->


<!-- SendWelcomeEmail.php -->
<?php

namespace App\Jobs;

use App\Mail\WelcomeEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendWelcomeEmail implements ShouldQueue
{
    use Queueable,InteractsWithQueue,SerializesModels;
    public $user;

    /**
     * Create a new job instance.
     */
    public function __construct($user)
    {
        $this->user=$user;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->user->email)->send(new WelcomeEmail($this->user));
    }
}



<!-- WelcomeEmail.php -->
<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    /**
     * Create a new message instance.
     */
    public function __construct($user)
    {
        $this->user=$user;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome Email',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.welcome-mail',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}


<!-- Route: -->
<!-- Queue Routes -->

Route::get('send',function(){
    $user=User::find(11);
    dispatch(new SendWelcomeEmail($user));
    dd($user);
});

<!-- welcome-mail.blade.php -->
<body>
    Hii, {{ $user->name }}
    <h2>This is a Test Welcome Email.</h2>
</body>

-------------------------------------------------------------------------------
<!-- MODEL OBSERVER -->

<!-- Observer is used to perform some background task  -->
<!-- Example:Whenever User register we will send mail to the user like you registered successfully -->


<!-- create model -->
php artisan make:model Post -m 

<!-- Create Resource Controller -->
php artisan make:controller PostController -r

<!-- Create Observer -->
 php artisan make:observer PostObserver --model=Post

<!-- Create Mail -->
php artisan make:mail PostCreateMail 

<!-- Create view -->
php artisan make:view post-created-mail
----------------------------------------
<!-- Data Flow -->
<!-- Here what we are doing is we created a post form on home page and on submit it will go to create method of post controller and at that time create method of observer will also automatically invoke and send mail and we will print email in laravel.log  -->

<!-- We have to register our observer in Provider boot method  -->
public function boot(): void
    {
        Schema::defaultStringLength(191);
        Post::observe(PostObserver::class);
    }

<!-- Route: -->
Route::resource('posts', PostController::class);

<!-- Controller -->
public function store(Request $request)
    {
        $post=new Post();
        $post->title='Test title';
        $post->description='Test Description';
        $post->save();      
    }
---------------------------------------------------
<!-- Observer -->
public function created(Post $post): void
    {
        Mail::to('nihaldemo@gmail.com')->send(new PostCreateMail());
    }

<!-- Post Observer method will automatically invoke when create method of postcontroller will invoke -->


<!-- Welcome view -->
<body>
    <form action="{{ route('posts.store') }}" method="post">
        @csrf
        <button type="submit">Save</button>
    </form>
</body>


<!-- PostCreateMail.php -->
<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PostCreateMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Post Create Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'post-created-mail',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}



.
--------------------------------
<!-- EVENT & LISTENER -->

<!-- Create Event -->
php artisan make:event

  What should the event be named?
❯ PostCreateEvent


<!-- Create Listener -->
php artisan make:listener

  What should the listener be named?
❯ PostCreateListener

  What event should be listened for? (Optional):
❯ PostCreateEvent




<!-- Inside PostController -->
 public function store(Request $request)
    {
        
        $post=new Post();
        $post->title='Test title';
        $post->description='Test Description';
        $post->save();
        event(new PostCreateEvent("nihalcharola11@gmail.com"));

        dd($post);
    }

<!-- Inside PostCreateEvent     -->
public function __construct(public $email)
    {
        // dd($email);
        // dd('Event Fired');
    }

 <!-- Inside PostCreateListener    -->
public function handle(PostCreateEvent $event): void
    {

        // dd("Name:".$event->name);
        Mail::to($event->email)->send(new PostCreateMail());
    }

.
------------------------------------------------------------
//To send mail without creation of mail instance
Route::get('send-mail',function(){
    Mail::send('post-created-mail', ['data' => 'Some data'], function ($message) {  
        $message->to('recipient@example.com')->subject('Test Email');  
    });
});






<!-- Dependency Injection -->

The dependency have to be a class.

Here laravel will create instance for us and we don't need to create instance by our self . this will make our code structure more clear.

<!-- Way-1 -->
 public function index(Request $request)
    {
        return [1,2,3,4,$request->id];
    }


<!-- Way-2
In Second way we are directly initializing the Request class in our constructore do all our method present in that class can have access of it. -->
<!-- So now I don't have to dependency injection in each method. -->
class SampleController extends Controller
{
    public $request;

    function __construct(Request $request){
        $this->request=$request;
    }
    
   
    public function index()
    {
        return [1,2,3,4,$this->request->id];
    }
}

<!-- Routes -->
Route::resource('/test',SampleController::class);


.
----------------------------------------
<!-- Service Container -->

<!-- Now what is the service container?

The Laravel service container is a powerful tool that manages the dependencies of class in your application.

It's like a central place where Laura will  store and resolve all the things your class need to work properly. -->


<!-- your application needs something like a specific tool. -->

<!-- Laravel knows exactly where to find it in the toolbox and hand it over. -->

<!-- If we bind anything in our container, we'll be able to access that item in our entire project. -->

<!-- service container hold the services and service provider basically provide service. -->




<!-- Inside AppServicePRovider.php -->
 public function register(): void
    {
        app()->bind('first_class',function($app){
            dd('This is my first service');
        });
    }

<!-- Routes: -->
Route::get('/test',function(){
    dd(app());
});


Route::get('get',function(){
    app()->make('first_class');
});



.
--------------------------------------
<!-- CUSTOM SERVICE PROVIDER -->




php artisan make:provider TestServiceProvider

<!-- Inside TestServiceProvider -->
public function register(): void
    {
        app()->bind('test_service',function($app){
            return 'This is test service';
        });
    }




<!-- Inside bootstrap/providers.php -->
<!-- In this file we have to register allour services  -->

<!-- Inside providers.php -->
<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\TestServiceProvider::class,
];



.
-----------------------------------------------
<!-- Service Class -->

php artisan make:class Services/NotificationService
php artisan make:provider NotificationServiceProvider

<!-- Bind method bind our service  -->
<!-- And whenever we use make method it will create new instance  -->

<!-- But whenever we use Singelton method it will not create new instance everytime . it will create only one instance -->


<!-- Here we are creating custom service using class -->

<!-- NotificationService -->
function send($message,$recipient){
        return "Notification sent to {$recipient} with message: {$message}";
    }


<!-- Notification Service Provider -->
 public function register(): void
    {
        $this->app->singleton(NotificationService::class,function($app){
                return new NotificationService();
        });
    }


<!-- Routes -->
Route::get('get',function(){
    $notification=app(NotificationService::class);
    dd($notification->send('Hello','Nihal'));
});


<!-- inside bootstrap/provides.php -->
<!-- We have to register all our services in this file -->
<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\NotificationServiceProvider::class,
    App\Providers\TestServiceProvider::class,
];



.
--------------------------------------------------------
<!-- Facades -->


<!-- Now Laravel Facades provide a convenient and static like interface to services that are bind in the Laravel service container. -->


<!-- Even though they look like a static methods behind the scenes, they are instance of classes that are resolved from the service container. -->

<!-- Facades are essentially a shortcut to access those services make code more readable and easier to write. -->

<!-- It is a approach to easily access to the services. -->
<!-- So obviously we have to say that the facade that we created for which service it will be using. -->


php artisan make:class Facades/Notification
<!-- It will create Notification.php inside app/Facades folder -->





<!-- Inside NotificationService.php -->
<?php

namespace App\Services;

class NotificationService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    function send($message,$recipient){
        return "Notification sent to {$recipient} with message: {$message}";
    }
}
--------

<!-- Inside NotificationServiceProvider.php -->
public function boot(): void
    {
       
        $this->app->alias(NotificationService::class,'Notification');
    }

<!-- Here we are giving alias  -->
.
--------------------
<!-- Important  -->
Make sure your alias is same that we are returning from getFacadeAccessor Method
--------------------

<!-- Facade file -->
Notification.php
<!-- You must need to extends Facade class and implements getFacadeAccessor method  -->
<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class Notification extends Facade
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    protected static function getFacadeAccessor(){
        return "Notification";
    }
}
-------

<!-- Route -->
Route::get('get',function(){
   dd( Notification::send('Hello','Nihal'));
    
});



.
-------------------------------------------
<!-- Traits -->

<!-- A trait is a mechanism that allows you to reuse code across multiple classes. -->

Create trait
php artisan make:trait Traits/ImageUpload

<!-- Now traits are uh, basically work like a class. -->

<!-- Just you don't have to create any kind of instance of it, uh, when you will be using it. -->


<!-- And whenever we'll be using this trade, we'll be able to access this methods without any kind of issue in any kind of class. -->


<!-- ImageUpload.php -->
<?php

namespace App\Traits;

trait ImageUpload
{
    function handleZipFile(){
        //handle zip file upload

        dd("HandleZip file ");
    }
}



<!-- We can use all this method in any class just we need to import our trait like below -->
<!-- use ImageUpload -->

SampleController.php
class SampleController extends Controller

{
  <!-- //Like this  -->
    use ImageUpload;

    public $request;

    function __construct(Request $request){
        $this->request=$request;
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->handleZipFile();
        // return [1,2,3,4,$request->id];
    }
}

<!-- Route: -->
Route::get('get',function(){
   dd( Notification::send('Hello','Nihal'));
    
});

.
--------------------------------------
<!-- Helper Function -->



<!-- Helper functions are those functions that we can access from our entire application from anywhere of our application, like from our web file controller, front end, front end blade, whatever, or wherever it is. -->

<!-- If it's a blade file will be able to call the helper functions. -->

.
--------------------
Important
You can't use trait inside blade file you can only use it in controller 
where helper function you can use anywhere 
--------------------

step-1
<!-- Create File manually inside app/Helpers/helper.php -->
helper.php
<?php

function makeSlug($text){
    return str_replace(' ','-',strtolower($text));
}




step-2
<!-- Then you have to register it in composer.json file's autoload section -->

 "autoload": {
        "psr-4": {
            "App\\": "app/",
            "Database\\Factories\\": "database/factories/",
            "Database\\Seeders\\": "database/seeders/"
        },
        "files":[
            "app/Helpers/helper.php"
        ]
    },

step-3
<!-- Run the command  -->
composer du



<!-- Now every function written inside that files you can access globally -->

<!-- Route: -->
//Helper Function
Route::get('/helper',function(){
return makeSlug("My name is Nihal Charola");
});



.
-------------------------------------------------------------------
<!-- Route Model Binding -->


<!-- what is this route model binding? -->

<!-- Laravel route model binding is a feature that allows you to automatically inject model instance into your route based on the route parameters, instead of manually retrieving a model instance by its ID or another identifier, you can let Laravel do it for you. -->

ProductController.php
<!-- Resource route -->

 public function show(Product $product)
    {
        return $product;
       
    }

<!-- Here we are binding the model with the route  $product is dynamic and it must be same name as you will get from command php artisan route:list . If you change it will give error  -->

public function update(Request $request, Product $product)
    {
        $product->name=$request->name;
    }
<!-- It will find to the particular id in our model and return result  -->

<!-- Route: -->
Route::resource('products', ProductController::class);

<!-- Web brower url -->
http://127.0.0.1:8000/products/1



<!-- Another way of model binding -->
php artisan make:controller TestProductController --resource --model=Product

<!-- TestProductController class  -->
<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class TestProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}





.
-------------------------------------------------

<!-- Localization -->




<!-- It enables your application to support multiple languages, make it accessible to a wider audience. -->




