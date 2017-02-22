export const getUrlParamValue = (paramsString, paramName) => {
    let paramValue = paramsString.split(`${paramName}=`)[1];
    const ampersandPosition = paramValue.indexOf('&');

    if (ampersandPosition !== -1) {
        paramValue = paramValue.substring(0, ampersandPosition);
    }

    return paramValue;
};
