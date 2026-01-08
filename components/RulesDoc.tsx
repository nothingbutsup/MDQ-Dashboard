import React from 'react';

const Article: React.FC<{ 
    number: string; 
    children: React.ReactNode; 
    category?: string; 
    title?: string;
    isBis?: boolean;
}> = ({ number, children, category, title, isBis }) => (
    <div className="mb-4 bg-slate-900/30 p-4 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-colors">
        <div className="flex justify-between items-start mb-2">
            <span className={`font-mono font-bold text-sm ${isBis ? 'text-emerald-400' : 'text-indigo-400'}`}>
                ART. {number}
            </span>
            {category && (
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${category.includes('CRÍTICA') ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-slate-300'}`}>
                    {category}
                </span>
            )}
        </div>
        {title && <h4 className="font-bold text-white text-sm mb-2">{title}</h4>}
        <div className="text-sm leading-relaxed text-slate-300 space-y-2">
            {children}
        </div>
    </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-8 mb-4 border-b border-slate-800 pb-2">
        {children}
    </h3>
);

export const RulesDoc: React.FC = () => {
    return (
        <div className="animate-fade-in pb-20">
            <div className="glass-panel p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                {/* Header */}
                <div className="border-b-2 border-slate-100 pb-6 mb-8">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter leading-none">
                            CÓDIGO DE<br />CONVIVENCIA
                        </h1>
                        <span className="bg-white text-slate-900 font-mono font-bold text-xs px-2 py-1">
                            REV. 2026
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 text-slate-400 text-sm">
                        <p>Edición Revisada — Temporada 2026</p>
                        <p className="font-mono text-xs opacity-60">DOCUMENTO OFICIAL</p>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    
                    {/* LIBRO PRIMERO */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-200 flex items-center gap-3 mb-6">
                            <span className="text-slate-600 font-mono text-2xl opacity-50">01</span>
                            LIBRO PRIMERO: DISPOSICIONES GENERALES
                        </h2>

                        <SectionTitle>TÍTULO I: APLICACIÓN DE LA LEY PENAL</SectionTitle>
                        <Article number="01">
                            Este Código se aplicará por delitos cometidos o cuyos efectos deban producirse en el
                            territorio de la Nación Argentina, o en los lugares sometidos a su jurisdicción (en adelante, "El Departamento").
                        </Article>
                        <Article number="02">
                            Si la ley vigente al tiempo de cometerse el delito fuere distinta de la que exista al pronunciarse
                            el fallo o en el tiempo intermedio, se aplicará siempre la más benigna. Si durante la condena se dictare
                            una ley más benigna, la pena se limitará a la establecida por esa ley. En todos los casos del presente
                            artículo, los efectos de la nueva ley se operarán de pleno derecho.
                        </Article>
                        <Article number="03">
                            Las disposiciones generales del presente código se aplicarán a todos los delitos previstos por
                            leyes especiales, en cuanto éstas no dispusieran lo contrario.
                        </Article>
                        <Article number="04">
                            Se considerará integrantes del grupo a las personas que hayan firmado al pie de este Código.
                        </Article>

                        <SectionTitle>TÍTULO II: DE LAS PENAS</SectionTitle>
                        <Article number="05">
                            Las penas que este Código establece son las siguientes: reclusión, amonestación y sanción.
                        </Article>
                        <Article number="06">
                            La pena de reclusión, perpetua o temporal, se cumplirá con trabajo obligatorio en los
                            establecimientos destinados al efecto.
                        </Article>
                        <Article number="07">
                            El producto del trabajo del condenado a reclusión se aplicará simultáneamente a indemnizar
                            los daños y perjuicios causados por el delito que no satisficiera con otros recursos.
                        </Article>

                        <SectionTitle>TÍTULO III: REPARACIÓN DE PERJUICIOS</SectionTitle>
                        <Article number="08">
                            La sentencia condenatoria podrá ordenar:
                            <ol className="list-decimal list-inside pl-2 mt-1 space-y-1 opacity-90">
                                <li>La reposición al estado anterior a la comisión del delito, en cuanto sea posible, disponiendo a ese fin las restituciones y demás medidas necesarias.</li>
                                <li>La indemnización del daño material y moral causado a la víctima.</li>
                            </ol>
                        </Article>
                        <Article number="09">
                            La obligación de reparar el daño es solidaria entre todos los responsables del delito.
                        </Article>
                        <Article number="10">
                            En caso de insolvencia total o parcial, tratándose de condenados a reclusión, se aplicará una
                            sanción bajo el nombre de "FALTA".
                        </Article>

                        <SectionTitle>TÍTULO IV: REINCIDENCIA</SectionTitle>
                        <Article number="11">
                            Habrá reincidencia siempre que quien hubiera cumplido, total o parcialmente, pena impuesta
                            por este código cometiere un nuevo delito punible también con esa clase de pena.
                        </Article>
                    </section>

                    {/* LIBRO SEGUNDO */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-200 flex items-center gap-3 mb-6 mt-12 pt-8 border-t border-slate-800">
                            <span className="text-slate-600 font-mono text-2xl opacity-50">02</span>
                            LIBRO SEGUNDO: DE LOS DELITOS
                        </h2>
                        
                        <Article number="12">
                            Se aplicará pena de acuerdo al sistema de categorías establecido en el presente código.
                        </Article>

                        <Article number="13" category="CAT. 1">
                            Se considerará FALTA de categoría 1 cuando, quien fuere designado para esa tarea de mutuo o
                            propio acuerdo, decidiere no sacar la basura del departamento.
                        </Article>

                        <Article number="14" category="CAT. 2">
                            Se considerará FALTA de categoría 2 cuando:
                            <ol className="list-decimal list-inside pl-2 mt-1 space-y-2 opacity-90">
                                <li>Quien fuere designado para esa tarea de mutuo o propio acuerdo, al momento de llevar la ropa al lavadero, no actúe en función de lo acordado. Esta tarea se realizará día por medio entre las 08:30 am y las 10:30 am.</li>
                                <li>Quien fuere designado para esa tarea de mutuo o propio acuerdo, decidiere no lavar su plato o los del resto de acuerdo a lo pactado entre los integrantes del grupo.</li>
                                <li>Cualquiera de los integrantes del grupo, dejare objetos en un lugar del departamento al que no pertenecieren o donde se haya acordado no dejarlos.</li>
                            </ol>
                        </Article>

                        <Article number="15" category="CAT. 3">
                            Se considerara FALTA de categoría 3 cuando:
                            <ol className="list-decimal list-inside pl-2 mt-1 space-y-2 opacity-90">
                                <li>Cualquiera de los integrantes del grupo incurriere en un comportamiento inadecuado en la vía pública que pudiere generar malestar o incomodidad al resto del grupo.</li>
                                <li>Cualquiera de los integrantes del grupo gritare o pusiere música a través de altavoces o parlantes, a pesar de las advertencias.</li>
                                <li>Al momento de llevar la ropa al lavadero, cualquiera de los integrantes del grupo no pagare por el servicio o no colocare su ropa en el canasto para evitar el pago.</li>
                                <li>Al momento de realizar las tareas designadas de Orden y Limpieza (al comienzo o durante el día), cualquiera de los integrantes del grupo decidiere no hacerlo.</li>
                                <li>Cualquiera de los integrantes del grupo decidiere no aportar la suma correspondiente destinada a la compra general y/o no acompañare al resto del grupo al momento de efectuar la misma.</li>
                                <li>Cualquiera de los integrantes del grupo hiciere uso de cualquier cama o colchón sin previamente haberse bañado y hubiere culminado la limpieza diaria del departamento.</li>
                            </ol>
                        </Article>

                        <Article number="16" category="CAT. 4">
                            Se considerará FALTA de categoría 4 cuando:
                            <ol className="list-decimal list-inside pl-2 mt-1 space-y-2 opacity-90">
                                <li>Cualquiera de los integrantes del grupo incurriere en un comportamiento inadecuado en el interior del departamento que pudiere generar malestar o incomodidad tanto al interior del grupo como a los vecinos.</li>
                                <li>Quien fuere designado para esa tarea, decidiere no cocinar para el resto del grupo de acuerdo a lo pactado.</li>
                                <li>Cualquiera de los integrantes del grupo, por el incorrecto manejo de su propio capital, decidiere pedir de forma continuada cualquier cantidad de dinero. <span className="text-white font-bold bg-rose-500/20 px-1 rounded">AGRAVANTE</span> Si se pide dinero teniendo fondos propios, la pena aumenta una categoría.</li>
                            </ol>
                        </Article>

                        <Article number="17" category="CAT. 5">
                            Cuando, de forma intencional o accidental, cualquiera de los integrantes del grupo dejare el baño
                            con una cantidad de agua o cualquier otro líquido que impida la correcta utilización del inodoro.
                        </Article>

                        <Article number="18" category="CAT. 6">
                            Se considerará FALTA de categoría 6 cuando:
                            <ol className="list-decimal list-inside pl-2 mt-1 space-y-1 opacity-90">
                                <li>Cualquiera de los integrantes del grupo arrojare objeto, cualquiera sean sus características, a través de la ventana del departamento.</li>
                                <li>De forma intencional o accidental, cualquiera de los integrantes del grupo rompiere un objeto que pertenezca a otro integrante, al grupo o al departamento. <span className="underline decoration-slate-500 underline-offset-2">Implica restitución obligatoria.</span></li>
                            </ol>
                        </Article>

                        <Article number="19" category="CAT. 7 / CRÍTICA">
                            Se considerará FALTA de categoría 7 cuando, cualquiera de los integrantes del grupo, ingresare al
                            departamento a cualquier otra persona ajena al mismo.
                        </Article>

                        <div className="my-8 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

                        <Article number="20" title="Comisión Especial">
                            Se establecerá la figura de FALTA EXTRAORDINARIA, evaluada por una
                            Comisión Especial integrada por las tres personas con menos FALTAS.
                        </Article>
                        <Article number="21" title="Advertencias">
                            Se aplicará un sistema de ADVERTENCIAS acumulables en plazos de 30
                            minutos. Tres advertencias implican intervención del comité especial.
                        </Article>
                        <Article number="22" title="Compensación">
                            Las FALTAS podrán ser compensadas realizando acciones opuestas a las
                            conductas estipuladas como faltas en los artículos 14, 15 y 16.
                        </Article>

                        <div className="border-2 border-slate-700 rounded-xl p-1 my-8">
                            <div className="bg-slate-800/50 rounded-lg p-6">
                                <Article number="22 BIS" title="SISTEMA DE DRAFT DIARIO" isBis>
                                    <p className="mb-4">
                                        A los efectos de la compensación de FALTAS, se habilitará diariamente un <strong>REGISTRO DE VOLUNTARIOS</strong> por tarea específica. Los integrantes del grupo que deseen compensar sus FALTAS deberán inscribirse previamente en dicho registro.
                                    </p>
                                    <p className="mb-4">
                                        Una vez cerrado el registro diario, se procederá a la <strong>DESIGNACIÓN ALEATORIA (DRAFT)</strong> entre los inscriptos para adjudicar la responsabilidad de la tarea.
                                    </p>
                                    <div className="bg-slate-900/50 p-4 rounded-lg italic border-l-4 border-emerald-500 text-emerald-100/80">
                                        Este procedimiento se reiterará todos los días del viaje. El no cumplimiento de las actividades
                                        para las que el integrante fuera designado mediante el Draft conllevará un incremento en la
                                        cantidad de FALTAS equivalente a las que hubiese compensado.
                                    </div>
                                </Article>
                            </div>
                        </div>

                        <Article number="23">
                            La reincidencia de una FALTA conllevará a una de 1 (una) categoría más alta.
                        </Article>
                        <Article number="24" title="Limpieza Final">
                            Las tres personas con mayor cantidad de FALTAS serán las encargadas de
                            realizar todas las labores de limpieza del día de regreso.
                        </Article>
                    </section>

                    {/* Final Section */}
                    <section className="bg-black/40 -mx-8 -mb-8 p-8 mt-12 border-t border-slate-800">
                        <Article number="26" title="PÉRDIDA DE PRIVILEGIOS">
                            <p className="mb-4 text-slate-400">Las FALTAS acumuladas llevarán a:</p>
                            <div className="space-y-2">
                                <div className="flex gap-4 items-center">
                                    <span className="w-8 h-8 flex items-center justify-center bg-white text-black font-bold font-mono text-xs rounded shadow-lg shrink-0">10</span>
                                    <span className="text-slate-300">Reducción del 50% en probabilidades de DRAFT de compensación.</span>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <span className="w-8 h-8 flex items-center justify-center bg-white text-black font-bold font-mono text-xs rounded shadow-lg shrink-0">15</span>
                                    <span className="text-slate-300">Pérdida de prioridad para bañarse, cocinar y comer.</span>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <span className="w-8 h-8 flex items-center justify-center bg-white text-black font-bold font-mono text-xs rounded shadow-lg shrink-0">20</span>
                                    <span className="text-slate-300">Pérdida de llaves del departamento.</span>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <span className="w-8 h-8 flex items-center justify-center bg-white text-black font-bold font-mono text-xs rounded shadow-lg shrink-0">25</span>
                                    <span className="text-slate-300">Evaluado como "subversivo" por la Comisión Especial.</span>
                                </div>
                            </div>
                        </Article>
                    </section>

                </div>
            </div>
        </div>
    );
};