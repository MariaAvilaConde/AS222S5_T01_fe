import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OpenAiService } from '../../service/open-ai.service';
import { OpenAiQuery } from '../../core/models/models';

@Component({
  selector: 'app-dasboard-open-ai',
  templateUrl: './dasboard-open-ai.component.html',
  styleUrls: ['./dasboard-open-ai.component.scss']
})
export class DasboardOpenAiComponent implements AfterViewChecked, OnInit {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  consulta = new FormControl('');
  conversacionActual: Array<{ texto: string, tipo: 'usuario' | 'ai', timestamp: Date }> = [];
  historialRespuestas: Array<{ texto: string, timestamp: Date }> = [];
  isLoading = false;

  // Nuevas propiedades para la paginación
  limiteMostrados = 5; // Número inicial de respuestas a mostrar
  incrementoLimite = 5; // Cantidad de respuestas adicionales a cargar
  limiteMaximo = 50; // Límite máximo de respuestas a mostrar

  constructor(private openAiService: OpenAiService) {}

  ngOnInit() {
    this.cargarHistorialChat();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }, 100);
    } catch(err) {
      console.error('Error al hacer scroll:', err);
    }
  }

  // Nuevo método para cargar más respuestas
  cargarMasRespuestas() {
    const nuevoLimite = this.limiteMostrados + this.incrementoLimite;
    this.limiteMostrados = Math.min(nuevoLimite, this.limiteMaximo);
  }

  cargarHistorialChat() {
    this.isLoading = true;
    this.openAiService.getAllChats().subscribe({
      next: (chats: OpenAiQuery[]) => {
        console.log('Chats recibidos:', chats);
        // Solo guardamos las respuestas de la IA en el historial y limitamos la cantidad
        this.historialRespuestas = chats.map(chat => ({
          texto: chat.response,
          timestamp: new Date(chat.timestamp)
        })).slice(0, this.limiteMaximo); // Limitamos el total de respuestas almacenadas
      },
      error: (error) => {
        console.error('Error al cargar el historial:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  enviarConsulta() {
    const mensaje = this.consulta.value?.trim();
    if (mensaje && !this.isLoading) {
      this.isLoading = true;

      const mensajeUsuario = {
        texto: mensaje,
        tipo: 'usuario' as const,
        timestamp: new Date()
      };
      this.conversacionActual = [mensajeUsuario];
      
      this.openAiService.createQuery(mensaje).subscribe({
        next: (response: OpenAiQuery) => {
          console.log('Respuesta recibida:', response);
          const mensajeAI = {
            texto: response.response,
            tipo: 'ai' as const,
            timestamp: new Date()
          };
          // Agregar respuesta a la conversación actual
          this.conversacionActual.push(mensajeAI);
          
          // Agregar respuesta al historial y mantener el límite
          this.historialRespuestas.unshift({
            texto: response.response,
            timestamp: new Date()
          });

          // Asegurarnos de no exceder el límite máximo
          if (this.historialRespuestas.length > this.limiteMaximo) {
            this.historialRespuestas = this.historialRespuestas.slice(0, this.limiteMaximo);
          }
          
          this.scrollToBottom();
        },
        error: (error) => {
          console.error('Error al obtener respuesta:', error);
          const mensajeError = {
            texto: 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo.',
            tipo: 'ai' as const,
            timestamp: new Date()
          };
          this.conversacionActual.push(mensajeError);
        },
        complete: () => {
          this.isLoading = false;
          this.consulta.reset();
        }
      });
    }
  }

  handleEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.enviarConsulta();
    }
  }

  // Método para obtener el mensaje que indica cuántas respuestas se están mostrando
  getMensajeContador(): string {
    return `Mostrando ${Math.min(this.limiteMostrados, this.historialRespuestas.length)} de ${this.historialRespuestas.length} respuestas`;
  }
}