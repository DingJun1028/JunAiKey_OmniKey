"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsHeaders = void 0;
exports.corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Or restrict to your frontend origin
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
