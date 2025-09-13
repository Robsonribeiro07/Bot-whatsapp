/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FindUserControoler } from './../controllers/user/get-user-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../controllers/user/create-new-user-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RemovoToParticipantController } from './../controllers/group/remove-to-participant-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Regenarate } from './../controllers/bot/regenate-Qrcode-controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "UserDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUserSchemaServices": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ICreateUserResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["bot-connectado"]},{"dataType":"enum","enums":["Usuario criado"]},{"dataType":"enum","enums":["Erro ao criar usuário"]},{"dataType":"enum","enums":["Houve um erro ao criar o bot"]},{"dataType":"enum","enums":["Erro interno no servidor"]}],"required":true},
            "user": {"ref":"IUserSchemaServices"},
            "QRcode": {"dataType":"string"},
            "base64": {"dataType":"string"},
            "statusBot": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateUserDTO": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGroupParticipant": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "isAdmin": {"dataType":"boolean","required":true},
            "isSuperAdmin": {"dataType":"boolean","required":true},
            "imgUrl": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IGroup": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "subject": {"dataType":"string","required":true},
            "creation": {"dataType":"double","required":true},
            "owner": {"dataType":"string","required":true},
            "imgUrl": {"dataType":"string"},
            "participants": {"dataType":"array","array":{"dataType":"refObject","ref":"IGroupParticipant"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUpdateWithWhatsappData": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"string"},
            "id": {"dataType":"string"},
            "name": {"dataType":"string"},
            "imgUrl": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
            "lid": {"dataType":"string"},
            "jid": {"dataType":"string"},
            "verifiedName": {"dataType":"string"},
            "notify": {"dataType":"string"},
            "connectedAt": {"dataType":"datetime"},
            "status": {"dataType":"string"},
            "user": {"dataType":"string"},
            "groups": {"dataType":"array","array":{"dataType":"refObject","ref":"IGroup"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IResponseRemoveParticipants": {
        "dataType": "refObject",
        "properties": {
            "code": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":[200]},{"dataType":"enum","enums":[404]},{"dataType":"enum","enums":[500]}],"required":true},
            "userUpdated": {"ref":"IUpdateWithWhatsappData"},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IRemoveParticipantToGroupDTO": {
        "dataType": "refObject",
        "properties": {
            "userId": {"dataType":"string","required":true},
            "participantsToRemove": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "groupId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IRegenerateQRCodeResponse": {
        "dataType": "refObject",
        "properties": {
            "qr": {"dataType":"any"},
            "base64": {"dataType":"string"},
            "message": {"dataType":"string"},
            "error": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IRegenareteQRcodeService": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsFindUserControoler_findUser: Record<string, TsoaRoute.ParameterSchema> = {
                jid: {"in":"query","name":"jid","required":true,"dataType":"string"},
        };
        app.get('/user/get-user',
            ...(fetchMiddlewares<RequestHandler>(FindUserControoler)),
            ...(fetchMiddlewares<RequestHandler>(FindUserControoler.prototype.findUser)),

            async function FindUserControoler_findUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsFindUserControoler_findUser, request, response });

                const controller = new FindUserControoler();

              await templateService.apiHandler({
                methodName: 'findUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_createUser: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"CreateUserDTO"},
        };
        app.post('/user/create',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.createUser)),

            async function UserController_createUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_createUser, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'createUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRemovoToParticipantController_remoteToParticipantControoler: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"IRemoveParticipantToGroupDTO"},
        };
        app.post('/group/remove-participant',
            ...(fetchMiddlewares<RequestHandler>(RemovoToParticipantController)),
            ...(fetchMiddlewares<RequestHandler>(RemovoToParticipantController.prototype.remoteToParticipantControoler)),

            async function RemovoToParticipantController_remoteToParticipantControoler(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRemovoToParticipantController_remoteToParticipantControoler, request, response });

                const controller = new RemovoToParticipantController();

              await templateService.apiHandler({
                methodName: 'remoteToParticipantControoler',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsRegenarate_regenaretaQRcode: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"IRegenareteQRcodeService"},
        };
        app.post('/bot/regenerate/qrcode',
            ...(fetchMiddlewares<RequestHandler>(Regenarate)),
            ...(fetchMiddlewares<RequestHandler>(Regenarate.prototype.regenaretaQRcode)),

            async function Regenarate_regenaretaQRcode(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsRegenarate_regenaretaQRcode, request, response });

                const controller = new Regenarate();

              await templateService.apiHandler({
                methodName: 'regenaretaQRcode',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
