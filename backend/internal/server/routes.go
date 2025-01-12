package server

import (
	"bufio"
	"encoding/json"
	"encoding/xml"
	"io"
	"net/http"
	"os"
)

func (s *Server) RegisterRoutes() http.Handler {

	mux := http.NewServeMux()
	mux.HandleFunc("GET /doc-ids", s.GetDocIds)
	mux.HandleFunc("GET /docs/{id}", s.GetDocument)
	mux.HandleFunc("PATCH /docs/{id}", s.UpdateDocument)
	mux.HandleFunc("DELETE /docs/{id}", s.DeleteDocument)
	mux.HandleFunc("OPTIONS /docs/{id}", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "*")
	})
	return mux
}

func (s *Server) GetDocIds(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	files, err := os.ReadDir("./internal/sample-xml")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Server Error"))
		panic(err)
	}
	docMap := map[string]string{}
	type id struct {
		Root string `xml:"root,attr"`
	}
	type Document struct {
		XMLName xml.Name `xml:"ClinicalDocument"`
		ID      id       `xml:"id"`
	}
	for _, file := range files {
		doc := Document{}
		fileStream, err := os.Open("./internal/sample-xml/" + file.Name())
		defer fileStream.Close()
		stat, err := fileStream.Stat()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal Server Error"))
			panic(err)
		}
		bs := make([]byte, stat.Size())
		_, err = bufio.NewReader(fileStream).Read(bs)
		err = xml.Unmarshal(bs, &doc)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Internal Server Error"))
			panic(err)
		}
		docMap[file.Name()] = doc.ID.Root
	}
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(docMap)
}

func (s *Server) GetDocument(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	docId := r.PathValue("id")
	file, err := os.ReadFile("./internal/sample-xml/" + docId)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("No file with this id was found"))
		panic(err)
	}
	w.Header().Set("Content-Type", "application/xml")
	w.WriteHeader(http.StatusOK)
	w.Write(file)
}

func (s *Server) UpdateDocument(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	docId := r.PathValue("id")
	b, err := io.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("No file with this id was found"))
		panic(err)
	}
	os.WriteFile("./internal/sample-xml/"+docId, b, os.ModeAppend)
	w.Header().Set("Content-Type", "application/xml")
	w.WriteHeader(http.StatusOK)
	w.Write(b)
}

func (s *Server) DeleteDocument(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	docId := r.PathValue("id")
	err := os.Remove("./internal/sample-xml/" + docId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Internal Server Error"))
		panic(err)
	}
	w.WriteHeader(http.StatusOK)
}
