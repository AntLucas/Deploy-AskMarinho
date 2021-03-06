import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Comment } from '../model/Comment';
import { Post } from '../model/Post';
import { Tag } from '../model/Tag';
import { User } from '../model/User';
import { AlertsService } from '../service/alerts.service';
import { CommentService } from '../service/comment.service';
import { PostService } from '../service/post.service';
import { TemasService } from '../service/tag.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  idUser = environment.id
  usuario: User = new User()

  temas: Tag[]
  tagAdicionada: Tag = new Tag()
  tagDelete: Tag = new Tag()
  tema: Tag = new Tag()
  idTagDelete: number
  tagFoiChamada = false
  
  postagensUser: Post[]
  idPostComentado: number
  idPostagemDelete: number
  postagemDeletada: Post = new Post()
  idPostEditar: number
  postagemEditada: Post = new Post()
  postagemEnviar: Post = new Post()

  comentarioEnviado: Comment = new Comment()
  commentsUsuario: Comment[]
  idCommentModif: number
  commentModif: Comment = new Comment()
  comentarioNoPost: Comment = new Comment()

  postLike: Post = new Post()
  comentarioLike: Comment = new Comment()
  postReport: Post = new Post()
  comentarioReport: Comment = new Comment()

  key = 'date'
  reverse = true
  reverso = false
  
  constructor(
    private router: Router,
    private commentService: CommentService,
    private alert: AlertsService,
    private tagService: TemasService,
    private userService: UserService,
    private postService: PostService
  ) { }

  ngOnInit() {
    if (environment.token == '') {

      this.router.navigate(['/login-page'])
      
    } else {
      window.scroll(0,0)
      this.postService.refreshToken()
      this.commentService.refreshToken()
      this.userService.refreshToken()
      this.pegarPeloId()
    }
  }

  tagChamada() {
    return this.tagFoiChamada
  }

  pegarPeloId() {
    this.userService.getUserById(environment.id).subscribe((resp: User) => {
      this.usuario = resp
      this.postagensUser = this.usuario.posts
      this.temas = this.usuario.favorites
      this.commentsUsuario = this.usuario.comments
    } , err => {
      if (err.status == 500) {
        this.alert.showAlertDanger("Por favor atualize a p??gina")
      }
    })
  }

  adicionarTag() {
    this.tagService.refreshToken()
    this.userService.refreshToken()

    if (this.tema.tagName == undefined) {
      this.alert.showAlertDanger("Tema n??o pode ser nulo!")
    } else if (this.tema.tagName.length < 3 || this.tema.tagName.length > 25) {
      this.alert.showAlertDanger("O tema deve ter entre 3 e 25 caracteres!")
    } else {
      this.userService.addFavorite(environment.id, this.tema.tagName).subscribe((resp: 
        User) => {
          
          this.pegarPeloId()
          this.tema = new Tag()
          this.usuario = resp
          this.alert.showAlertSuccess("Tag favorita adicionada com sucesso!")
        }, err => {
          if (err.status == 500) {
            this.alert.showAlertInfo("Por favor atualize a p??gina")
          } else if (err.status == 403) {
            this.alert.showAlertDanger("A tag n??o pode conter caracteres especiais")
          } else if (err.status == 400) {
            this.alert.showAlertDanger("Usu??rio n??o existe, por favor recarregue a p??gina")
          }
      })
    }
  }

  chamou(idPost: number) {
    this.idPostComentado = idPost
  }

  adicionarNovoTema() {

    if (this.tagAdicionada.tagName == undefined) {
      this.alert.showAlertDanger("Tema n??o pode ser nulo!")
    } else if (this.tagAdicionada.tagName.length < 3 || this.tagAdicionada.tagName.length > 25) {
      this.alert.showAlertDanger("O tema deve ter entre 3 e 25 caracteres!")
    } else {
      this.postService.addTagPostagem(this.tagAdicionada.tagName, this.idPostEditar).subscribe((resp: Post) => {
        this.alert.showAlertSuccess("Adicionada")
        this.tagAdicionada = new Tag()
        this.pegarPeloId()
        this.findByIdPost()
      }, err => {
        if (err.status == 500) {
          this.alert.showAlertDanger("Por favor atualize a p??gina")
        } else if (err.status == 403) {
          this.alert.showAlertDanger("O nome da tag n??o pode conter caracteres especiais")
        } else if (err.status == 400) {
          this.alert.showAlertDanger("A postagem n??o existe")
        }
      })
    }
  }

  idPostEdit(idPostagem: number) {
    this.idPostEditar = idPostagem
    this.findByIdPost()
  }

  findByIdPost() {
    this.postService.postagemFindById(this.idPostEditar).subscribe((resp: Post) => {
      this.postagemEditada = resp
    }, err => {
      if (err.status == 500) {
        this.alert.showAlertDanger("Por favor atualize a p??gina")
      }
    })
  }

  findByIdPostagem() {
    this.postService.postagemFindById(this.idPostagemDelete).subscribe((resp: Post) => {
      this.postagemDeletada = resp
    }, err => {
      if (err.status == 500) {
        this.alert.showAlertDanger("Por favor atualize a p??gina")
      }
    })
  }

  atualizarPostagem() {
    this.postagemEnviar.title = this.postagemEditada.title
    this.postagemEnviar.date = this.postagemEditada.date
    this.postagemEnviar.description = this.postagemEditada.description
    this.postagemEnviar.urlImage = this.postagemEditada.urlImage


     if (this.postagemEditada.title == undefined) {
      this.alert.showAlertDanger("T??tulo n??o pode ser nulo!")
    } else if (this.postagemEditada.title.length < 3 || this.postagemEditada.title.length > 100) {
      this.alert.showAlertDanger("T??tulo deve ter entre 3 e 100 caracteres!")
    } else if (this.postagemEditada.description == undefined) {
      this.alert.showAlertDanger("Descri????o n??o pode ser nula!")
    } else if (this.postagemEditada.description.length < 3 || this.postagemEditada.description.length > 500) {
      this.alert.showAlertDanger("Descri????o deve ter entre 3 e 500 caracteres!")
    } else {

    this.postService.putPostagem(this.idPostEditar, this.postagemEnviar).subscribe((resp: Post) => {
      
      this.postagemEditada = new Post()
      this.idPostEditar = 0
      this.pegarPeloId()
      this.tagAdicionada = new Tag()
      this.alert.showAlertSuccess("Postagem editada com sucesso!")
    }, err => {
      if (err.status == 500) {
        this.alert.showAlertDanger("Por favor atualize a p??gina")
      } else if (err.status == 403) {
        this.alert.showAlertDanger("O t??tulo n??o pode ser vazio")
      } else if (err.status == 405) {
        this.alert.showAlertDanger("A descri????o n??o pode ser vazia")
      } else if (err.status == 400) {
        this.alert.showAlertDanger("A postagem n??o existe")
      }
    }) 
  }
  }

  removerTagPost(idTag: number) {
    this.postService.deleteTagPostagem(this.idPostEditar, idTag).subscribe((resp: Post) => {
      this.pegarPeloId()
      this.findByIdPost()
    }, err => {
      if (err.status == 500) {
        this.alert.showAlertDanger("Por favor atualize a p??gina")
      }
    })
  }

  limpar() {
    this.tema = new Tag()
    this.tagAdicionada = new Tag()
    this.tagDelete = new Tag()
    this.idTagDelete = 0
    this.tagFoiChamada = false

    this.idPostEditar = 0
    this.postagemEditada = new Post()
    this.idPostComentado = 0
    this.idPostagemDelete = 0
    this.postagemDeletada = new Post()
    this.postagemEnviar = new Post()

    this.comentarioEnviado = new Comment()
    this.idCommentModif = 0
    this.commentModif = new Comment()
  }

  idPostDelete(idPost: number) {
    this.idPostagemDelete = idPost
    this.findByIdPostagem()
  }

  deletarPostagem() {
    
    this.postService.deletePostagem(this.idPostagemDelete).subscribe(() => {
      
      this.limpar()
      this.pegarPeloId()
      this.alert.showAlertSuccess("Postagem exclu??da com sucesso!")
    }, erro => {
      if (erro.status == 200) {
        this.alert.showAlertSuccess("Postagem exclu??da com sucesso!")
      } else if (erro.status == 500) {
        this.alert.showAlertSuccess("Por favor atualize a p??gina")
      }
      
      this.limpar()
      this.pegarPeloId()
    })
    
  }

  findByIdComment() {
    this.commentService.commentFindById(this.idCommentModif).subscribe((resp: Comment) => {
      this.commentModif = resp
    }, err => {
      if (err.status == 500) {
        this.alert.showAlertSuccess("Por favor atualize a p??gina")
      }
    })
  }

  CommentModificado(idComentario: number) {
    this.idCommentModif = idComentario
    this.findByIdComment()
  }

  editarComment() {
    this.comentarioEnviado.text = this.commentModif.text
    
    if (this.comentarioEnviado.text == undefined) {
      this.alert.showAlertDanger("Coment??rio n??o pode ser nulo!")
    } else if (this.comentarioEnviado.text.length < 1 || this.comentarioEnviado.text.length > 155) {
      this.alert.showAlertDanger("Coment??rio deve ter entre 1 e 155 caracteres!")
    } else if (this.comentarioEnviado.text.includes("viado")) {
      this.alert.showAlertYellow("\"viado\" ?? uma palavra impr??pria.")
    } else if (this.comentarioEnviado.text.includes("cuz??o")) {
        this.alert.showAlertYellow("\"cuz??o\" ?? uma palavra impr??pria.")
    } else if (this.comentarioEnviado.text.includes("putinha")) {
        this.alert.showAlertYellow("\"putinha\" ?? uma palavra impr??pria.")
    } else if (this.comentarioEnviado.text.includes("buceta")) {
        this.alert.showAlertYellow("\"buceta\" ?? uma palavra impr??pria.")
    } else {
      this.commentService.putComment(this.idCommentModif, this.comentarioEnviado).subscribe((resp: Comment) => {
        
        this.alert.showAlertSuccess("Coment??rio editado!")
        this.pegarPeloId()
      }, err => {
        if (err.status == 500) {
          this.alert.showAlertSuccess("Por favor atualize a p??gina")
        } else if (err.status == 403) {
          this.alert.showAlertSuccess("O texto do coment??rio n??o pode ser vazio")
        } else if (err.status == 404) {
          this.alert.showAlertSuccess("O coment??rio n??o existe, por favor atualize a p??gina")
        }
      })
    }
  }

  deletarComment() {
    this.commentService.deleteComment(this.idCommentModif).subscribe(() => {
      this.alert.showAlertSuccess("Coment??rio exclu??do")
      this.pegarPeloId()
      this.idCommentModif = 0
      this.commentModif = new Comment()
    }, erro => {
      if (erro.status == 500) {
        this.alert.showAlertDanger("Por favor atualize a p??gina")
      } else if (erro.status == 200) {
        this.alert.showAlertSuccess("Coment??rio exclu??do")
      }
      this.pegarPeloId()
      this.idCommentModif = 0
      this.commentModif = new Comment()
    })
  }

  idTagFavorita(idTagFav: number) {
    this.idTagDelete = idTagFav
    this.tagService.tagFindById(this.idTagDelete).subscribe((resp: Tag) => {
      this.tagDelete = resp
      this.tagFoiChamada = true
      this.tagChamada()
    }, err => {
      if (err.status == 500) {
        this.alert.showAlertDanger("Por favor atualize a p??gina")
      }
    })
  }

  deleteFavoriteTag() {
    this.userService.deleteTag(environment.id, this.idTagDelete).subscribe(() => {
      
      
    }, objeto => {
      if (objeto.status == 500) {
        this.alert.showAlertDanger("Por favor atualize a p??gina")
      } else if(objeto.status == 202) {
        this.alert.showAlertSuccess("Tema favorito exclu??do")
        this.pegarPeloId()
      } else if (objeto.status == 200) {
        this.alert.showAlertYellow("Esse usu??rio n??o possui esse tema")
      } else if (objeto.status == 400) {
        this.alert.showAlertDanger("Tema e/ou usu??rio n??o existem")
      }
    })
  }

  upvoteComment(idComment: number) {
    this.userService.refreshToken()
    this.userService.postUpvoteComment(environment.id, idComment).subscribe((resp: Comment) => {
      this.comentarioLike = resp
      
       this.pegarPeloId()
 
    }, err => {
      if (err.status == 500) {
        this.alert.showAlertDanger("Por favor atualize a p??gina")
      }
    })
  }

  reportComment(idComment: number) {
    this.userService.refreshToken()
     this.userService.postReportComment(environment.id, idComment).subscribe((resp: Comment) => {
       this.comentarioReport = resp
       
        this.pegarPeloId()

     })
   }

   upvotePost(idPost: number) {
    this.userService.refreshToken()
     this.userService.postUpvotePost(environment.id, idPost).subscribe((resp: Post) => {
       this.postLike = resp
       
        this.pegarPeloId()

     }, err => {
      if (err.status == 500) {
        this.alert.showAlertDanger("Por favor atualize a p??gina")
      }
     })
   }
 
   reportPost(idPost: number) {
     this.userService.refreshToken()
     this.userService.postReportPost(environment.id, idPost).subscribe((resp: Post) => {
       this.postReport = resp
       
       this.pegarPeloId()
    
     }, err => {
      if (err.status == 500) {
        this.alert.showAlertDanger("Por favor atualize a p??gina")
      }
     })
   }

   comentar() {

    if (this.comentarioNoPost.text == undefined) {
      this.alert.showAlertDanger("Coment??rio n??o pode ser nulo!")
    } else if (this.comentarioNoPost.text.length < 1 || this.comentarioNoPost.text.length > 155) {
      this.alert.showAlertDanger("Coment??rio deve ter entre 1 e 155 caracteres!")
    } else if (this.comentarioNoPost.text.includes("viado")) {
      this.alert.showAlertYellow("\"viado\" ?? uma palavra impr??pria.")
    } else if (this.comentarioNoPost.text.includes("cuz??o")) {
        this.alert.showAlertYellow("\"cuz??o\" ?? uma palavra impr??pria.")
    } else if (this.comentarioNoPost.text.includes("putinha")) {
        this.alert.showAlertYellow("\"putinha\" ?? uma palavra impr??pria.")
    } else if (this.comentarioNoPost.text.includes("buceta")) {
        this.alert.showAlertYellow("\"buceta\" ?? uma palavra impr??pria.")
    } else {
        this.commentService.postComment(environment.id, this.idPostComentado, this.comentarioNoPost).subscribe((resp: Comment) => {
          this.comentarioNoPost = resp
          this.alert.showAlertSuccess("Coment??rio adicionado com sucesso!")
          
          this.pegarPeloId()
        
          this.comentarioNoPost = new Comment()
        }, err => {
          if (err.status == 500) {
            this.alert.showAlertDanger("Por favor atualize a p??gina")
          } else if (err.status == 403) {
            this.alert.showAlertDanger("O texto n??o pode ser vazio")
          } else if (err.status == 400) {
            this.alert.showAlertDanger("Postagem n??o existe, por favor atualize a p??gina")
          } else if (err.status == 404) {
            this.alert.showAlertDanger("Usu??rio n??o existe, por favor atualize a p??gina")
          }
        })
    }
  }
}
