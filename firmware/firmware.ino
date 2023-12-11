// Autor: MATEUS FERNANDES DOIMO
// Versao 1.5
// Atualizado em 07/12/2023

#include <string.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <EEPROM.h>

// Tamanho total da EEPROM em bytes (24C04 tem 512 bytes)
#define EEPROM_SIZE 512 
#define EEPROM_ADDRESS 0x50

// ULTRASSONICO
#define SOUND_SPEED 0.034
#define CM_TO_INCH 0.393701
#define BUTTON_PIN 21 

long duration;
float distanceCm;

const int trigPin = 5;
const int echoPin = 18;

// LEDS
const int LED_1 = 25;
const int LED_2 = 32;

// BUZZER
const int buzzer = 26;

// MOTORES
const int motor1Pin1 = 13; 
const int motor1Pin2 = 12; 

const int motor2Pin3 = 14; 
const int motor2Pin4 = 27; 

// WIFI
const char* ssid = "ROBO-ESP32";
const char* password = "password";

// STATUS
int STATUS_CAR = 0;

// WS
AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

void setEEPROM(int address, int data){
  EEPROM.begin(EEPROM_SIZE);
  EEPROM.write(address, data);
  EEPROM.commit();
  EEPROM.end();
  delay(5);
}

int getEEPROM(int address){
  EEPROM.begin(EEPROM_SIZE);
  int valueRead = EEPROM.read(address);
  EEPROM.end();
  return valueRead;
}

void saveCode(String *comandos, int tamanho){
  if(tamanho > 500){
     return;
  }
  
  // Quantidade dos comandos
  setEEPROM(1,tamanho);

  // Salva comandos em memória
  for (int i = 0; i < tamanho; i++) {
   int intComando = comandos[i].toInt();
   setEEPROM((i+2),intComando);
  }

  return;
}

// Para o carrinho
void parar() {
  digitalWrite(motor1Pin1, LOW);
  digitalWrite(motor1Pin2, LOW);
  digitalWrite(motor2Pin3, LOW);
  digitalWrite(motor2Pin4, LOW);
  return;
}

// Anda o carrinho para frente
void acaoA(){
  digitalWrite(motor1Pin1, HIGH);
  digitalWrite(motor1Pin2, LOW); 
  digitalWrite(motor2Pin3, HIGH);
  digitalWrite(motor2Pin4, LOW);
  delay(500);
  parar(); 
  return;
}

// Retornar carrinho 
void acaoR(){
  digitalWrite(motor1Pin1, LOW);
  digitalWrite(motor1Pin2, HIGH); 
  digitalWrite(motor2Pin3, LOW);
  digitalWrite(motor2Pin4, HIGH); 
  delay(500);
  parar(); 
  return;
}

// Virar esquerda
void acaoE(){
  digitalWrite(motor1Pin1, LOW);
  digitalWrite(motor1Pin2, LOW);
  digitalWrite(motor2Pin3, HIGH);
  digitalWrite(motor2Pin4, LOW);
  return;
}

// Virar direira
void acaoD(){
  digitalWrite(motor1Pin1, HIGH);
  digitalWrite(motor1Pin2, LOW);
  digitalWrite(motor2Pin3, LOW);
  digitalWrite(motor2Pin4, LOW);
  return;
}

// Buzina
void acaoB(){
  tone(buzzer,262,250*0.9); //DO
  delay(250);
  noTone(buzzer);
  tone(buzzer,294,250*0.9); //RE
  delay(250);
  noTone(buzzer);
  return;
}

void esperaCar(int *ponteiro){
  int tempo_d = 0;

    for (int i = 0; i < 4; i++) {
      (*ponteiro)++;
      tempo_d += getEEPROM(((*ponteiro)+2));
      Serial.println(tempo_d);
    }
    
    Serial.println(tempo_d*10);
    delay(tempo_d*10);
    parar();
}

// Pegar distancia de obstáculos
float distancia(){
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
 
  duration = pulseIn(echoPin, HIGH);
  distanceCm = duration * SOUND_SPEED/2;

  delay(100);
  return distanceCm;
}

// Slit para serparar comandos
int splitString(String input, String delimiter, String* resultArray, int maxElements) {
  int index = 0;
  int fromIndex = 0;
  int toIndex;

  while (index < maxElements) {
    toIndex = input.indexOf(delimiter, fromIndex);

    if (toIndex == -1) {
      resultArray[index++] = input.substring(fromIndex);
      break;
    } else {
      resultArray[index++] = input.substring(fromIndex, toIndex);
      fromIndex = toIndex + 1;
    }
  }

  return index;
}

void setStatus(int status){

  if(status == 2){
    digitalWrite(LED_1, LOW);
    digitalWrite(LED_2, HIGH);
  }
  else if(status == 1) {
    digitalWrite(LED_1, LOW);
    digitalWrite(LED_2, HIGH);
  }
  else if(status == 0) {
    digitalWrite(LED_1, HIGH);
    digitalWrite(LED_2, LOW);
  }
  
  STATUS_CAR = status;
  setEEPROM(0, STATUS_CAR);
  Serial.print("STATUS: ");
  Serial.println(STATUS_CAR);
}

void initStatus(){
  STATUS_CAR = getEEPROM(0);
  if(STATUS_CAR == 3){
    setStatus(2);
  }
  Serial.print("STATUS: ");
  Serial.println(STATUS_CAR);
}

// Pega status do carrinho atual e criar em formato json 
String getStatusJson(){
  StaticJsonDocument<128> respJson;
  respJson["tipo"] = 1;
  respJson["status"] = STATUS_CAR;

  String resp;
  serializeJson(respJson, resp);
  return resp;
}

// WS
void onWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len) {
  if (type == WS_EVT_CONNECT) {
    Serial.println("Novo cliente conectado");
    client->text(getStatusJson());
  } else if (type == WS_EVT_DISCONNECT) {
    Serial.println("Cliente desconectado");
  } else if (type == WS_EVT_DATA) {
    AwsFrameInfo *info = (AwsFrameInfo*)arg;
    if (info->final && info->index == 0 && info->len == len && info->opcode == WS_TEXT) {
      String message = String((char*)data);
      Serial.println("Mensagem recebida: " + message);

      StaticJsonDocument<512> doc;
      DeserializationError error = deserializeJson(doc, message);

      if (!error) {
        int tipo = doc["tipo"];
        int tamanho;
        String codigo;
        
        switch (tipo) {
          case 2:
          {
            setStatus(1);
            client->text(getStatusJson());
            tamanho = doc["tamanho"];
            codigo = (const char*)doc["codigo"];

            String delimiter = ",";
  
            String resultArray[tamanho]; 
            int elementCount = splitString(codigo, delimiter, resultArray, tamanho);

            for (int i = 0; i < elementCount; i++) {
              int inteiro = resultArray[i].toInt();
            }
                      
            saveCode(resultArray, tamanho);
            setStatus(2);
            client->text(getStatusJson());
            
            break;
          }
      
          case 3:
          {
            setStatus(3);
            client->text(getStatusJson());
            break;
          }
          case 4:
          {
            setStatus(0);
            client->text(getStatusJson());
            break;
          }
          default:
          {
            client->text(getStatusJson());
          }
        }
      } else {
        Serial.println("Erro ao fazer parse da mensagem JSON");
      }
    }
  }
}

int realizarOperacao(int operador, int modo, int distVal) {
    float distancia_atual = distancia();
    float distancia = distVal*1.0;
    
    int resultado = 0;
    
    switch (operador) {
        case 1: // "="
            if (modo == 1) {
                resultado = (distancia_atual == distancia);
            } else {
                resultado = (distancia == distancia_atual);
            }
            break;
        case 2: // "≠"
            if (modo == 1) {
                resultado = (distancia_atual != distancia);
            } else {
                resultado = (distancia != distancia_atual);
            }
            break;
        case 3: // "<"
            if (modo == 1) {
                resultado = (distancia_atual < distancia);
            } else {
                resultado = (distancia < distancia_atual);
            }
            break;
        case 4: // "≤"
            if (modo == 1) {
                resultado = (distancia_atual <= distancia);
            } else {
                resultado = (distancia <= distancia_atual);
            }
            break;
        case 5: // ">"
            if (modo == 1) {
                resultado = (distancia_atual > distancia);
            } else {
                resultado = (distancia > distancia_atual);
            }
            break;
        case 6: // "≥"
            if (modo == 1) {
                resultado = (distancia_atual >= distancia);
            } else {
                resultado = (distancia >= distancia_atual);
            }
            break;
        default:
            resultado = 0;
            break;
    }

    return resultado;
}

void executaAcao(int comando, int *ponteiro) {

  if(comando == 98){
    acaoA();
  }
  else if(comando == 97){
    acaoR();
  }
  else if(comando == 96){
    acaoB();
  }
  else if(comando == 92){
    acaoE();
    esperaCar(ponteiro);
    delay(100);
  }
  else if(comando == 91){
    acaoD();
    esperaCar(ponteiro);
    delay(100);
  }
  else if(comando == 90){
    parar();
  }
  else if(comando == 89){
    int tempo_d = 0;

    for (int i = 0; i < 4; i++) {
      (*ponteiro)++;
      comando = getEEPROM(((*ponteiro)+2));
      tempo_d += comando;
    }
    
    delay(tempo_d*10);
    
  }
  else if(comando == 95){
    
   int flag = 0;
   int opera = 0;
   int argIf = 0;
    
   (*ponteiro)++;
   
   comando = getEEPROM(((*ponteiro)+2));

   if(comando == 93){
     // DIS OP NUM
     (*ponteiro)++;
     opera = getEEPROM(((*ponteiro)+2));
     (*ponteiro)++;
     argIf = getEEPROM(((*ponteiro)+2));

     int respCod = realizarOperacao(opera, 1, argIf);
     
     (*ponteiro)++;
     comando = getEEPROM(((*ponteiro)+2));
     
     while(comando != 94){
      if(respCod){
        executaAcao(comando, ponteiro);
      }
      (*ponteiro)++;
      comando = getEEPROM(((*ponteiro)+2));
      Serial.print("COM: ");
      Serial.println(comando);
     }
   }
   else{
     // NUM OP DIS
     argIf = comando;
     (*ponteiro)++;
     opera = getEEPROM(((*ponteiro)+2));

     int respCod = realizarOperacao(opera, 2, argIf);
     
     (*ponteiro)++;
     comando = getEEPROM(((*ponteiro)+2));
     
     while(comando != 94){
      if(respCod){
        executaAcao(comando, ponteiro);
      }
      (*ponteiro)++;
      comando = getEEPROM(((*ponteiro)+2));
      Serial.print("COM: ");
      Serial.println(comando);
     }
   }
  }
  return;
}

void runCode(){
  int ponteiro;
  int tamanho = getEEPROM(1);
  
  for (ponteiro = 0; ponteiro < tamanho; ponteiro++) {
   digitalWrite(LED_1, HIGH);
   digitalWrite(LED_2, HIGH);
  
   int comando = getEEPROM((ponteiro+2));
   executaAcao(comando, &ponteiro);
   if(STATUS_CAR != 3){
    break;
   }
   delay(50);

   digitalWrite(LED_1, LOW);
   digitalWrite(LED_2, LOW);
  }
  setStatus(2);
  ws.textAll(getStatusJson());
}

void IRAM_ATTR isr() {
  if(STATUS_CAR == 3){
    STATUS_CAR = 2;
    parar();
  } 
  else if(STATUS_CAR == 2){
    STATUS_CAR = 3;
  }
}

void setup() {
  Serial.begin(115200);

  // Configuracao da acesso a memoria EEPROM
  Wire.begin();
  initStatus();

  // Configuracao do buzzer
  pinMode(buzzer, OUTPUT);

  // Configuracao da interrupcao
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  attachInterrupt(BUTTON_PIN, isr, FALLING);

  // Configuracoes dos leds indicadores
  pinMode(LED_1, OUTPUT);
  pinMode(LED_2, OUTPUT);

  digitalWrite(LED_1, LOW);
  digitalWrite(LED_2, LOW);

  // Configuracao do sensor ultrassonico
  pinMode(trigPin, OUTPUT); 
  pinMode(echoPin, INPUT); 

  // Configuracao dos motores
  pinMode(motor1Pin1, OUTPUT);
  pinMode(motor1Pin2, OUTPUT);

  pinMode(motor2Pin3, OUTPUT);
  pinMode(motor2Pin4, OUTPUT);

  parar();

  // Configurar o ESP32 como um ponto de acesso
  IPAddress apIP(192, 168, 1, 10); 
  IPAddress netMsk(255, 255, 255, 0); 

  WiFi.softAPConfig(apIP, apIP, netMsk);
  WiFi.softAP(ssid, password, 1, 0, 1);
  IPAddress IP = WiFi.softAPIP();
  
  Serial.print("Endereço IP do AP: ");
  Serial.println(IP);

  // Configuracao do server WS
  ws.onEvent(onWsEvent);
  server.addHandler(&ws);
  server.begin();
}

void loop() {
 
  if(STATUS_CAR == 3){
    runCode();
  }
  delay(100);
}
