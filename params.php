<?php
//Página em php para a configuração de parâmetros para alterar o banco de dados utilizado
    include_once('config.php');
    //Incluindo composer
    require './vendor/autoload.php';
    $dotenv = Dotenv\Dotenv::createUnsafeMutable(__DIR__);
    $dotenv->load();

    // Senha para login
    $LOGIN_PASS = getenv('PARAM_LOGIN');

    // Pegando as variáveis do banco de dados
    $DB_USER = getenv('DB_USER'); 
    $DB_PASS = getenv('DB_PASS'); 
    $DB_HOST = getenv('DB_HOST');
    $DB_PORT = getenv('DB_PORT');
    $DB_SERVICE = getenv('DB_SERVICE');
    //Salvando as variáveis no arquivo .env
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Pegue os dados do formulário
        $host = $_POST['host'];
        $port = $_POST['port'];
        $user = $_POST['userdb'];
        $pass = $_POST['passdb'];
        $service = $_POST['service'];

        // Conteúdo para o arquivo .env
        $envContent = "DB_USER=$user\nDB_PASS=$pass\nDB_HOST=$host\nDB_PORT=$port\nDB_SERVICE=$service\nPARAM_LOGIN=$LOGIN_PASS";

        // Atualize o arquivo .env
        file_put_contents(__DIR__ . '/.env', $envContent);

        $_SESSION['sucesso'] = 'Dados atualizados com sucesso!';
        header("Location: params.php");
        exit;
    }   

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Cliente</title>
    <script>
        function goBack() {
            window.location.href = 'login.php';
        }
    </script>

    <script>
        function verifyPassword() {
            var password = document.getElementById("pass").value;
            var correctPassword = "<?php echo $LOGIN_PASS; ?>";
            var loginForm = document.getElementById("login-param");
            var mainForm = document.getElementById("formulario");
            
            if (password === correctPassword) {
                loginForm.style.display = "none";
                mainForm.style.display = "block";
            } else {
                alert("Senha incorreta. Tente novamente.");
            }
        }
        // Função para desvanecer a mensagem após um tempo
        function hideMessage() {
            var successMessage = document.getElementById('success-message');
            if (successMessage) {
                setTimeout(function() {
                    successMessage.style.transition = 'opacity 2s'; // Efeito de transição
                    successMessage.style.opacity = 0; // Desvanecer
                    setTimeout(function() {
                        successMessage.style.display = 'none'; // Remover do DOM
                    }, 3000); // Tempo para desaparecer completamente
                }, 1000); // Tempo para esperar antes de desvanecer
            }
        }
    </script>
        <style>
        .version-text {
            position: fixed;
            bottom: 10px;
            right: 10px;
            font-size: 12px;
            color: #777;
            z-index: 1000;
        }
    </style>
</head>

<body onload="hideMessage()">
    <div class="container">
        <div class="login-form">
            <h2>Parametrização</h2>
            <form action="params.php" method="POST" id="login-param" autocomplete="off">
                <div class="item-form" style="margin-bottom: 5px;">
                    <label for="host">Senha</label>
                    <input required type="text" id="pass" name="pass" placeholder="Senha de acesso">
                </div>
                <button type="button" name="logar" onclick="verifyPassword()" id="botaoDois">Entrar</button>
                <button type="button" onclick="goBack()">Voltar</button>
                <?php
                    // Verificar se há uma mensagem de sucesso e exibe
                    if (isset($_SESSION['sucesso'])) {
                        echo '<p id="success-message" style="color:green; font-size:14px; margin-bottom:10px;">' . $_SESSION['sucesso'] . '</p>';
                        unset($_SESSION['sucesso']); // Remova a mensagem após exibi-la
                    }
                ?>
            </form>
            <form action="params.php" method="POST" id="formulario" style="display:none">
                <div class="item-form" style="margin-bottom: 5px;">
                    <label for="host">Host</label>
                    <input required type="text" id="host" name="host" placeholder="IP do banco" value=<?php echo $DB_HOST ?>>
                </div>
                <div class="item-form" style="margin-bottom: 5px;">
                    <label for="port">Porta</label>
                    <input required type="text" id="port" name="port" placeholder="Porta do banco" value=<?php echo $DB_PORT ?>>
                </div>
                <div class="item-form" style="margin-bottom: 5px;">
                    <label for="userdb">Usuário</label>
                    <input required type="text" id="userdb" name="userdb" placeholder="Usuário do banco" value=<?php echo $DB_USER ?>>
                </div>
                <div class="item-form" style="margin-bottom: 5px;">
                    <label for="passdb">Senha</label>
                    <input required type="text" id="passdb" name="passdb" placeholder="Senha do banco" value=<?php echo $DB_PASS ?>>
                </div>
                <div class="item-form" style="margin-bottom: 5px;">
                    <label for="service">Service Name</label>
                    <input required type="tel" id="service" name="service" placeholder="Nome do serviço" value=<?php echo $DB_SERVICE ?>>
                </div>

                <button type="submit" name="enviar" id="botaoEnviar">Salvar</button>
                <button type="button" onclick="goBack()">Voltar</button>
            </form>

        </div>
    </div>
</body>
<div class="version-text">
        <?php echo $version?>
    </div>
</html>