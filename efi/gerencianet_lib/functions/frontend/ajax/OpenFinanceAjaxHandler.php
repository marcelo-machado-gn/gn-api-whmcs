<?php
require_once __DIR__ . '/../../../../../../../init.php';

if (file_exists($autoload = realpath(__DIR__ . "/../../../../gerencianet-sdk/autoload.php"))) {
	require_once $autoload;
} else {
	echo json_encode(array("error" => "could not find autoload file for the SDK"));
    return;
}

use Gerencianet\Exception\GerencianetException;
use Gerencianet\Gerencianet;

App::load_function('gateway');


// Fetch gateway configuration parameters
$gatewayParams = getGatewayVariables('efi');

if ($gatewayParams == null || $gatewayParams['activeOpenFinance'] != 'on') {
    echo json_encode(array("error", "Open Finance resources are off or unavailable"));
    return;
}

$options = array();

/**
 * Generates an random prefix to compose a unique ID for
 * open finance idempotency key.
 */
function uniqidRealTest($lenght = 30) {
   
    if (function_exists("random_bytes")) {
        $bytes = random_bytes(ceil($lenght / 2));
    } elseif (function_exists("openssl_random_pseudo_bytes")) {
        $bytes = openssl_random_pseudo_bytes(ceil($lenght / 2));
    } else {
        throw new Exception("no cryptographically secure random function available");
    }
    return substr(bin2hex($bytes), 0, $lenght);
}

if (isset($_GET['participants'])) {
    
    if ($gatewayParams['sandbox'] != 'on') {
        $options['client_id'] = $gatewayParams['clientIdProd'];
        $options['client_secret'] = $gatewayParams['clientSecretProd'];
        $options['sandbox'] = FALSE;
        $options['certificate'] = $gatewayParams['pixCert'];
    } 
    
    else {
        $options['client_id'] = $gatewayParams['clientIdSandbox'];
        $options['client_secret'] = $gatewayParams['clientSecretSandbox'];
        $options['sandbox'] = TRUE;
        $options['certificate'] = $gatewayParams['pixCert'];
    }
    
    
    
    try {
        $api = Gerencianet::getInstance($options);
        $response = $api->ofListParticipants($params);
    
        echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } catch (GerencianetException $e) {
        echo json_encode(array(
            'code' => $e->code,
            'error' => $e->error,
            'description' => $e->errorDescription
        ));
    } catch (Exception $e) {
        echo json_encode(array('error' => $e->getMessage()));
    }
} 

else if (isset($_GET['test'])) {

    $arr = array();

    for ($i = 0; $i < 10; $i += 1) {
        $arr[$i] = trim(uniqid(uniqidRealTest(), true), '.');
    }
    
    print_r($arr);
}

else {
    echo json_encode($gatewayParams);
}


return;