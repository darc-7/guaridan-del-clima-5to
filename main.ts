//  Aquí iría el bloque específico de la extensión DHT11
//  Simulamos lectura para este ejemplo de código base
//  En MakeCode real: humedad_actual = dht11.dht11_read(PIN_DHT11, dht11.DHT11Type.HUMIDITY)
function leer_sensor() {
    
    dht11_dht22.queryData(DHTtype.DHT11, DigitalPin.P8, true, false, false)
    if (dht11_dht22.readDataSuccessful()) {
        humedad_actual = dht11_dht22.readData(dataType.humidity)
        humedad_actual = dht11_dht22.readData(dataType.humidity)
        makerbit.showStringOnLcd1602("" + ("" + dht11_dht22.readData(dataType.humidity)), makerbit.position1602(LcdPosition1602.Pos12), 16)
    }
    
    makerbit.showStringOnLcd1602(estado_sistema, makerbit.position1602(LcdPosition1602.Pos17), 16)
    serial.writeValue("humedad", dht11_dht22.readData(dataType.humidity))
    basic.pause(2000)
}

let humedad_actual = 0
let estado_sistema = ""
estado_sistema = "ESTABLE"
//  PROYECTO: GUARDIÁN DEL CLIMA
//  Lógica con Histéresis y Control de Estados
//  --- CONFIGURACIÓN ---
let umbral_seco_activar = 45
//  Enciende humidificador si baja de 45%
let umbral_seco_apagar = 50
//  Apaga humidificador solo si sube a 50% (Margen de seguridad)
let umbral_humedo_activar = 65
//  Enciende secado si sube de 65%
let umbral_humedo_apagar = 60
//  Puede ser: ESTABLE, HUMIDIFICANDO, SECANDO
//  Pines (Ajustar según tabla de Hardware)
let PIN_DHT11 = DigitalPin.P8
let PIN_SERVO = AnalogPin.P2
let PIN_MOTOR = DigitalPin.P12
let MOTOR_CONTROL = AnalogPin.P16
let PIN_LED_AZUL = DigitalPin.P0
let PIN_LED_ROJO = DigitalPin.P1
//  Inicialización
pins.servoWritePin(PIN_SERVO, 0)
pins.analogWritePin(AnalogPin.P16, 767)
//  Cerrar compuerta
basic.showIcon(IconNames.Target)
makerbit.connectLcd(39)
makerbit.setLcdBacklight(LcdBacklight.On)
makerbit.showStringOnLcd1602("Humedad:", makerbit.position1602(LcdPosition1602.Pos1), 16)
//  Leer cada 2 segundos
//  Compuerta Cerrada
basic.forever(function on_forever() {
    if (estado_sistema == "ESTABLE") {
        pins.digitalWritePin(PIN_LED_AZUL, 0)
        pins.digitalWritePin(PIN_LED_ROJO, 0)
        pins.digitalWritePin(PIN_MOTOR, 0)
        pins.analogWritePin(MOTOR_CONTROL, 0)
        pins.servoWritePin(PIN_SERVO, 0)
    } else if (estado_sistema == "HUMIDIFICANDO") {
        pins.digitalWritePin(PIN_LED_AZUL, 1)
        pins.digitalWritePin(PIN_LED_ROJO, 0)
        pins.digitalWritePin(PIN_MOTOR, 1)
        pins.analogWritePin(MOTOR_CONTROL, 767)
        //  Ventilador ON
        pins.servoWritePin(PIN_SERVO, 0)
    } else if (estado_sistema == "SECANDO") {
        pins.digitalWritePin(PIN_LED_AZUL, 0)
        pins.digitalWritePin(PIN_LED_ROJO, 1)
        pins.digitalWritePin(PIN_MOTOR, 1)
        //  Ventilador ON (Circulación)
        pins.servoWritePin(PIN_SERVO, 90)
        pins.analogWritePin(MOTOR_CONTROL, 767)
    }
    
})
//  Leer cada 2 segundos
//  Compuerta Cerrada
basic.forever(function on_forever2() {
    
    leer_sensor()
    if (humedad_actual < umbral_seco_activar) {
        estado_sistema = "HUMIDIFICANDO"
        //  Cerrar compuerta
        basic.showIcon(IconNames.QuarterNote)
    } else if (estado_sistema == "HUMIDIFICANDO" && humedad_actual > umbral_seco_apagar) {
        estado_sistema = "ESTABLE"
        //  Cerrar compuerta
        basic.showIcon(IconNames.Pitchfork)
    } else if (humedad_actual > umbral_humedo_activar) {
        //  --- MODO SECADO ---
        estado_sistema = "SECANDO"
        //  Cerrar compuerta
        basic.showIcon(IconNames.Fabulous)
    } else if (estado_sistema == "SECANDO" && humedad_actual < umbral_humedo_apagar) {
        estado_sistema = "ESTABLE"
        //  Cerrar compuerta
        basic.showIcon(IconNames.Pitchfork)
    }
    
})
