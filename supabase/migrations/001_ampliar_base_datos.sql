-- ==========================================
-- ALESTEDUARTE RESERVAS
-- MIGRACIÓN 001
-- ==========================================

-- TABLA PASAJEROS
CREATE TABLE IF NOT EXISTS public.pasajeros (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    reserva_id UUID NOT NULL
        REFERENCES public.reservas(id)
        ON DELETE CASCADE,

    nombre VARCHAR(100) NOT NULL,

    apellidos VARCHAR(150) NOT NULL,

    documento_identidad VARCHAR(50),

    fecha_nacimiento DATE,

    telefono VARCHAR(30),

    es_conductor BOOLEAN DEFAULT FALSE,

    acepta_condiciones BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS pasajeros_reserva_idx
ON public.pasajeros(reserva_id);



-- TABLA PAGOS
CREATE TABLE IF NOT EXISTS public.pagos (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    reserva_id UUID NOT NULL
        REFERENCES public.reservas(id)
        ON DELETE RESTRICT,

    proveedor VARCHAR(30) DEFAULT 'REDSYS',

    referencia_operacion VARCHAR(100),

    importe_centimos INTEGER NOT NULL,

    estado VARCHAR(30) DEFAULT 'PENDIENTE',

    respuesta_proveedor JSONB,

    pagado_en TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW()

);

CREATE INDEX IF NOT EXISTS pagos_reserva_idx
ON public.pagos(reserva_id);



-- TABLA EVENTOS GOOGLE CALENDAR

CREATE TABLE IF NOT EXISTS public.eventos_calendario (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    reserva_id UUID UNIQUE
        REFERENCES public.reservas(id)
        ON DELETE CASCADE,

    calendario VARCHAR(100) DEFAULT 'ONLINE',

    evento_google_id TEXT,

    estado VARCHAR(30) DEFAULT 'PENDIENTE',

    ultimo_error TEXT,

    sincronizado_en TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW()

);

ALTER TABLE public.pasajeros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos_calendario ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- FIN MIGRACIÓN 001
-- ==========================================
