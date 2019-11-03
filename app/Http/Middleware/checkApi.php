<?php

namespace App\Http\Middleware;

use Closure;

class checkApi
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if($request->header('api') != 'beatsaber' && $request->header('host') != 'localhost') return abort(403);
        return $next($request);
    }
}
