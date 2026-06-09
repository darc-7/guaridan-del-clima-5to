// Aquí iría el bloque específico de la extensión DHT11
// Simulamos lectura para este ejemplo de código base
// En MakeCode real: humedad_actual = dht11.dht11_read(PIN_DHT11, dht11.DHT11Type.HUMIDITY)
function leer_sensor () {
    let estado_sistema = 0
    dht11_dht22.queryData(
    DHTtype.DHT11,
    DigitalPin.P8,
    true,
    false,
    false
    )
    if (dht11_dht22.readDataSuccessful()) {
        humedad_actual = dht11_dht22.readData(dataType.humidity)
        humedad_actual = dht11_dht22.readData(dataType.humidity)
        makerbit.showStringOnLcd1602("" + (dht11_dht22.readData(dataType.humidity)), makerbit.position1602(LcdPosition1602.Pos12), 16)
    }
    makerbit.showStringOnLcd1602("" + (estado_sistema), makerbit.position1602(LcdPosition1602.Pos17), 16)
}
let humedad_actual = 0
// PROYECTO: GUARDIÁN DEL CLIMA
// Lógica con Histéresis y Control de Estados
// --- CONFIGURACIÓN ---
let umbral_seco_activar = 45
// Enciende humidificador si baja de 45%
let umbral_seco_apagar = 50
// Apaga humidificador solo si sube a 50% (Margen de seguridad)
let umbral_humedo_activar = 65
// Enciende secado si sube de 65%
let umbral_humedo_apagar = 60
// Puede ser: ESTABLE, HUMIDIFICANDO, SECANDO
// Pines (Ajustar según tabla de Hardware)
let PIN_DHT11 = DigitalPin.P8
let PIN_SERVO = AnalogPin.P2
let PIN_MOTOR = DigitalPin.P12
let PIN_LED_AZUL = DigitalPin.P0
let PIN_LED_ROJO = DigitalPin.P1
// Inicialización
pins.servoWritePin(PIN_SERVO, 3)
// Cerrar compuerta
basic.showIcon(IconNames.Target)
makerbit.connectLcd(39)
makerbit.setLcdBacklight(LcdBacklight.On)
makerbit.showStringOnLcd1602("Humedad:", makerbit.position1602(LcdPosition1602.Pos1), 16)
// Leer cada 2 segundos
basic.forever(function () {
    leer_sensor()
    basic.pause(1000)
})
