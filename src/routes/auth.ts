import { Handler, Router } from 'express';
import {
	loginController,
	registerController,
} from '../app/auth/AuthController';
import { emailPasswordValidator } from '../app/auth/AuthValidator';

enum Methods {
    POST = 'post',
    GET = 'get',
    PATCH = 'patch',
    PUT = 'put',
    DELETE = 'delete',
}

interface route {
    method: Methods;
    url: string;
    validations: Handler[] | [];
    controller: Handler;
}

const router = Router(),
	routes: route[] = [
		{
			method: Methods.POST,
			url: '/login',
			validations: [emailPasswordValidator],
			controller: loginController,
		},
		{
			method: Methods.POST,
			url: '/register',
			validations: [emailPasswordValidator],
			controller: registerController,
		},
	];

function appendRoute(router: Router, routes: route[], index = 0) {
	const route = routes[index];

	router[route.method](route.url, route.validations, route.controller);

	if (index === routes.length - 1) return router;

	appendRoute(router, routes, index + 1);
}

export default function () {
	appendRoute(router, routes);

	return router;
}
