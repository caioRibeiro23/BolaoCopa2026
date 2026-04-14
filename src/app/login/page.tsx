'use client'

export default function LoginPage() {
    return(
        <div className="flex items-center justify-center bg-[url('/background/fundoLogin.png')] bg-cover bg-center h-screen font-inter">
            <div className="w-1/2 bp-1024:w-3/12 bg-azulEscuro/82 border border-[#FFFFFF]/10 rounded-2xl flex flex-col items-start px-9 py-10 gap-6">
                <div>
                    <h1>Entrar na sua conta</h1>
                    <p>Bem vindo! Faça login para continuar</p>
                </div>
               <div>
                    <div>
                        <h3>E-mail</h3>
                        <input type="email" placeholder="seuemail@exemplo.com"/>
                    </div>
                    <div>
                        <div>
                            <h3>Senha</h3>
                            <a href="#">Esqueci minha senha</a>
                        </div>
                        <input type="password" placeholder="Digite sua senha"/>
                    </div>
                    <button>Entrar</button>
                    <p>Ainda não tem uma conta? <a href="#">Cadastre-se grátis</a></p>
               </div>
            </div>
        </div>
    )
}

/* Frame */

// box-sizing: border-box;

// /* Auto layout */
// display: flex;
// flex-direction: column;
// align-items: flex-start;
// padding: 41px 37px;
// gap: 24px;

// width: 550px;
// height: 539px;

// background: rgba(10, 14, 26, 0.82);
// border: 1px solid rgba(255, 255, 255, 0.1);
// border-radius: 20px;

// /* Inside auto layout */
// flex: none;
// order: 0;
// flex-grow: 0;
// z-index: 0;
