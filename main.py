# Aquí iría el bloque específico de la extensión DHT11
# Simulamos lectura para este ejemplo de código base
# En MakeCode real: humedad_actual = dht11.dht11_read(PIN_DHT11, dht11.DHT11Type.HUMIDITY)
def leer_sensor():
    global humedad_actual
    dht11_dht22.query_data(DHTtype.DHT11, DigitalPin.P8, True, False, False)
    if dht11_dht22.read_data_successful():
        humedad_actual = dht11_dht22.read_data(dataType.HUMIDITY)
        humedad_actual = dht11_dht22.read_data(dataType.HUMIDITY)
        makerbit.show_string_on_lcd1602("" + str(dht11_dht22.read_data(dataType.HUMIDITY)),
            makerbit.position1602(LcdPosition1602.POS12),
            16)
    makerbit.show_string_on_lcd1602(estado_sistema,
        makerbit.position1602(LcdPosition1602.POS17),
        16)
humedad_actual = 0
estado_sistema = ""
estado_sistema = "ESTABLE"
# PROYECTO: GUARDIÁN DEL CLIMA
# Lógica con Histéresis y Control de Estados
# --- CONFIGURACIÓN ---
umbral_seco_activar = 45
# Enciende humidificador si baja de 45%
umbral_seco_apagar = 50
# Apaga humidificador solo si sube a 50% (Margen de seguridad)
umbral_humedo_activar = 65
# Enciende secado si sube de 65%
umbral_humedo_apagar = 60
# Puede ser: ESTABLE, HUMIDIFICANDO, SECANDO
# Pines (Ajustar según tabla de Hardware)
PIN_DHT11 = DigitalPin.P8
PIN_SERVO = AnalogPin.P2
PIN_MOTOR = DigitalPin.P12
PIN_LED_AZUL = DigitalPin.P0
PIN_LED_ROJO = DigitalPin.P1
# Inicialización
pins.servo_write_pin(PIN_SERVO, 3)
# Cerrar compuerta
basic.show_icon(IconNames.TARGET)
makerbit.connect_lcd(39)
makerbit.set_lcd_backlight(LcdBacklight.ON)
makerbit.show_string_on_lcd1602("Humedad:", makerbit.position1602(LcdPosition1602.POS1), 16)
# Leer cada 2 segundos

def on_forever():
    global estado_sistema
    leer_sensor()
    basic.pause(2000)
    if humedad_actual < umbral_seco_activar:
        estado_sistema = "HUMIDIFICANDO"
    elif estado_sistema == "HUMIDIFICANDO" and humedad_actual > umbral_seco_apagar:
        estado_sistema = "ESTABLE"
    elif humedad_actual > umbral_humedo_activar:
        # --- MODO SECADO ---
        estado_sistema = "SECANDO"
    elif estado_sistema == "SECANDO" and humedad_actual < umbral_humedo_apagar:
        estado_sistema = "ESTABLE"
basic.forever(on_forever)
