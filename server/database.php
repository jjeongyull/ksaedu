<?php
  // 데이터베이스 연결을 위한 class 생성
  class DatabaseService {

    private $db_host;
    private $db_name;
    private $db_user;
    private $db_user_password;
    private $db_charset;
    private $db_port;

    private $connection;

    public function __construct(string $db_host, string $db_user, string $db_user_password, string $db_name, int $db_port=3306, string $db_charset = "utf8"){
        $this->db_host = $db_host;
        $this->db_user = $db_user;
        $this->db_user_password = $db_user_password;
        $this->db_name = $db_name;
        $this->db_charset = $db_charset;
        $this->db_port = $db_port;
    }

    public function getConnection(){
        try{
            $db_dsn = "mysql:host=$this->db_host;port=$this->db_port;dbname=$this->db_name;charset=$this->db_charset";
            $this->connection = new PDO ($db_dsn, $this->db_user, $this->db_user_password);
            // DB한글 깨짐 처리
            $this->connection->exec('SET NAMES utf8'); 
            $this->connection->exec('SET session character_set_connection=utf8'); 
            $this->connection->exec('SET session character_set_results=utf8'); 
            $this->connection->exec('SET session character_set_client=utf8'); 
        }catch(PDOException $exception){
            echo "Connection Failed : " . $exception->getMessage();
        }
        return $this->connection;
    }
  }
?>